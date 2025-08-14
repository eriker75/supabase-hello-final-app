import { supabase } from "@/src/utils/supabase";
import {
  Chat,
  CreateChatRequest,
  CreateChatResponse,
  DeleteChatRequest,
  DeleteChatResponse,
  DeleteMessageRequest,
  DeleteMessageResponse,
  GetChatRequest,
  GetChatResponse,
  GetMessageRequest,
  GetMessageResponse,
  ListChatsRequest,
  ListChatsResponse,
  ListMessagesRequest,
  ListMessagesResponse,
  Message,
  PatchMessageRequest,
  PatchMessageResponse,
  PostMessageRequest,
  PostMessageResponse,
  UnreadMessageCountRequest,
  UnreadMessageCountResponse,
  UpdateChatRequest,
  UpdateChatResponse,
} from "../../domain/models/chat";
import { Profile } from "../../domain/models/profile";

export class ChatController {
  async createChat(req: CreateChatRequest): Promise<CreateChatResponse> {
    const { name, creator_id } = req;
    if (!name || !creator_id) {
      throw new Error("--name and --creator_id are required");
    }
    const { data, error } = await supabase
      .from("chats")
      .insert([{ name, creator_id }])
      .select();
    if (error || !data || data.length === 0) {
      throw new Error(
        "Error creating chat: " + (error?.message || "Unknown error")
      );
    }
    return { chat_id: data[0].id };
  }

  async listChats(req: ListChatsRequest): Promise<ListChatsResponse> {
    const page = req.page && req.page > 0 ? req.page : 1;
    const perPage = req.perPage && req.perPage > 0 ? req.perPage : 20;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let chats: Chat[] = [];
    let total = 0;
    let hasMore = false;

    if (req.user_id) {
      // Get chat IDs where user is a participant
      const { data: participantRows, error: participantError } = await supabase
        .from("participants")
        .select("chat_id")
        .eq("user_id", req.user_id);

      if (participantError) {
        throw new Error(
          "Error fetching participant chat IDs: " + participantError.message
        );
      }

      const chatIds = (participantRows || []).map((row: { chat_id: string }) => row.chat_id);

      if (chatIds.length === 0) {
        return {
          chats: [],
          page,
          perPage,
          total: 0,
          hasMore: false,
        };
      }

      // Query chats by IDs with pagination
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .in("id", chatIds)
        .range(from, to);

      if (error) {
        throw new Error("Error listing chats: " + error.message);
      }

      total = chatIds.length;
      hasMore = to + 1 < total;
      chats = data || [];
    } else {
      // Global chat listing
      const { data, error, count } = await supabase
        .from("chats")
        .select("*", { count: "exact" })
        .range(from, to);

      if (error) {
        throw new Error("Error listing chats: " + error.message);
      }

      total = typeof count === "number" ? count : 0;
      hasMore = to + 1 < total;
      chats = data || [];
    }

    // Enrich chats with last_message and other_profile
    const lastMessageIds = chats
      .map((chat: any) => chat.last_message_id)
      .filter((id: string | undefined) => !!id);

    let lastMessagesMap: Record<string, Message> = {};
    if (lastMessageIds.length > 0) {
      const { data: lastMessages, error: lastMsgError } = await supabase
        .from("messages")
        .select("*")
        .in("id", lastMessageIds);
      if (lastMsgError) {
        throw new Error(
          "Error fetching last messages: " + lastMsgError.message
        );
      }
      if (lastMessages) {
        lastMessagesMap = Object.fromEntries(
          lastMessages.map((msg: Message) => [msg.id, msg])
        );
      }
    }

    let otherUserIds: string[] = [];
    if (req.user_id) {
      for (const chat of chats) {
        if ((chat as any).type === "private") {
          const { data: participants, error: partError } = await supabase
            .from("participants")
            .select("user_id")
            .eq("chat_id", chat.id);
          if (partError) {
            throw new Error(
              "Error fetching participants: " + partError.message
            );
          }
          if (participants && participants.length === 2) {
            const other = participants.find(
              (p: any) => p.user_id !== req.user_id
            );
            if (other) {
              otherUserIds.push(other.user_id);
              (chat as any)._other_user_id = other.user_id;
            } else {
              (chat as any)._other_user_id = undefined;
            }
          } else {
            (chat as any)._other_user_id = undefined;
          }
        } else {
          (chat as any)._other_user_id = undefined;
        }
      }
    }

    let profilesMap: Record<string, Profile> = {};
    if (otherUserIds.length > 0) {
      const { data: profiles, error: profError } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", otherUserIds);
      if (profError) {
        throw new Error(
          "Error fetching other participant profiles: " + profError.message
        );
      }
      if (profiles) {
        profilesMap = Object.fromEntries(
          profiles.map((prof: Profile) => [prof.user_id, prof])
        );
      }
    }

    const enrichedChats: Chat[] = chats.map((chat: any) => {
      let other_profile: Profile | undefined = undefined;
      if (chat.type === "private" && chat._other_user_id) {
        other_profile = profilesMap[chat._other_user_id];
      }
      if ("_other_user_id" in chat) {
        delete chat._other_user_id;
      }
      return {
        ...chat,
        last_message: chat.last_message_id
          ? lastMessagesMap[chat.last_message_id]
          : undefined,
        other_profile,
      };
    });

    return {
      chats: enrichedChats,
      page,
      perPage,
      total,
      hasMore,
    };
  }

  async getChat(req: GetChatRequest): Promise<GetChatResponse> {
    const { id, user_id } = req;
    if (!id) {
      throw new Error("--id is required");
    }
    const { data, error } = await supabase.from("chats").select("*").eq("id", id);
    if (error) {
      throw new Error("Error getting chat: " + error.message);
    }
    if (!data || data.length === 0) {
      throw new Error("No chat found for id: " + id);
    }
    const chat = data[0];

    let other_profile: Profile | undefined = undefined;
    if (chat.type === "private" && user_id) {
      const { data: participants, error: partError } = await supabase
        .from("participants")
        .select("user_id")
        .eq("chat_id", id);
      if (partError) {
        throw new Error("Error fetching participants: " + partError.message);
      }
      if (participants && participants.length === 2) {
        const other = participants.find((p: any) => p.user_id !== user_id);
        if (other) {
          const { data: profiles, error: profError } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", other.user_id);
          if (profError) {
            throw new Error(
              "Error fetching other participant profile: " + profError.message
            );
          }
          if (profiles && profiles.length > 0) {
            other_profile = profiles[0] as Profile;
          }
        }
      }
    }
    return { chat, other_profile };
  }

  async updateChat(req: UpdateChatRequest): Promise<UpdateChatResponse> {
    const { id, ...fields } = req;
    if (!id) {
      throw new Error("--id is required");
    }
    const { error } = await supabase.from("chats").update(fields).eq("id", id);
    if (error) {
      throw new Error("Error updating chat: " + error.message);
    }
    return { success: true };
  }

  async deleteChat(req: DeleteChatRequest): Promise<DeleteChatResponse> {
    const { id } = req;
    if (!id) {
      throw new Error("--id is required");
    }
    const { error } = await supabase.from("chats").delete().eq("id", id);
    if (error) {
      throw new Error("Error deleting chat: " + error.message);
    }
    return { success: true };
  }

  async listMessages(req: ListMessagesRequest): Promise<ListMessagesResponse> {
    const { chat_id, page, perPage, user_id } = req;
    if (!chat_id) {
      throw new Error("--chat_id is required");
    }
    const pageNum = page && page > 0 ? page : 1;
    const perPageNum = perPage && perPage > 0 ? perPage : 20;
    const from = (pageNum - 1) * perPageNum;
    const to = from + perPageNum - 1;

    const {
      data: messages,
      error,
      count,
    } = await supabase
      .from("messages")
      .select("*", { count: "exact" })
      .eq("chat_id", chat_id)
      .order("created_at", { ascending: true })
      .range(from, to);

    if (error) {
      throw new Error("Error listing messages: " + error.message);
    }

    const total =
      typeof count === "number" ? count : messages ? messages.length : 0;
    const hasMore = to + 1 < total;

    // Fetch participants
    const { data: participants, error: partError } = await supabase
      .from("participants")
      .select("user_id")
      .eq("chat_id", chat_id);

    if (partError) {
      throw new Error("Error fetching chat participants: " + partError.message);
    }

    let other_profile: Profile | undefined = undefined;
    if (participants && participants.length === 2 && user_id) {
      let otherUserId = participants[0].user_id;
      if (participants[0].user_id === user_id) {
        otherUserId = participants[1].user_id;
      } else if (participants[1].user_id === user_id) {
        otherUserId = participants[0].user_id;
      }
      const { data: profiles, error: profError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", otherUserId);
      if (profError) {
        throw new Error(
          "Error fetching other participant profile: " + profError.message
        );
      }
      if (profiles && profiles.length > 0) {
        other_profile = profiles[0] as Profile;
      }
    }

    return {
      messages: (messages || []) as Message[],
      page: pageNum,
      perPage: perPageNum,
      total,
      hasMore,
      chat_id,
      other_profile,
    };
  }

  async getMessage(req: GetMessageRequest): Promise<GetMessageResponse> {
    const { chat_id, message_id, user_id } = req;
    if (!chat_id || !message_id) {
      throw new Error("--chat_id and --message_id are required");
    }
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chat_id)
      .eq("id", message_id);

    if (error) {
      throw new Error("Error getting message: " + error.message);
    }
    if (!data || data.length === 0) {
      throw new Error("No message found for id: " + message_id);
    }

    let other_profile: Profile | undefined = undefined;
    if (user_id) {
      const { data: chatRows, error: chatError } = await supabase
        .from("chats")
        .select("*")
        .eq("id", chat_id);
      if (chatError) {
        throw new Error("Error fetching chat for message: " + chatError.message);
      }
      if (chatRows && chatRows.length > 0 && chatRows[0].type === "private") {
        const { data: participants, error: partError } = await supabase
          .from("participants")
          .select("user_id")
          .eq("chat_id", chat_id);
        if (partError) {
          throw new Error("Error fetching participants: " + partError.message);
        }
        if (participants && participants.length === 2) {
          const other = participants.find((p: any) => p.user_id !== user_id);
          if (other) {
            const { data: profiles, error: profError } = await supabase
              .from("profiles")
              .select("*")
              .eq("user_id", other.user_id);
            if (profError) {
              throw new Error(
                "Error fetching other participant profile: " + profError.message
              );
            }
            if (profiles && profiles.length > 0) {
              other_profile = profiles[0] as Profile;
            }
          }
        }
      }
    }

    return { message: data[0] as Message, other_profile };
  }

  async postMessage(req: PostMessageRequest): Promise<PostMessageResponse> {
    const { chat_id, sender_id, content, type } = req;
    if (!chat_id || !sender_id || !content) {
      throw new Error("--chat_id, --sender_id, and --content are required");
    }
    const insertObj: any = { chat_id, sender_id, content };
    if (type !== undefined) insertObj.type = type;
    const { data, error } = await supabase
      .from("messages")
      .insert([insertObj])
      .select();
    if (error || !data || data.length === 0) {
      throw new Error(
        "Error posting message: " + (error?.message || "Unknown error")
      );
    }
    const message_id = data[0].id;
    // Update last_message_id in the chat
    const { error: updateError } = await supabase
      .from("chats")
      .update({ last_message_id: message_id })
      .eq("id", chat_id);
    if (updateError) {
      throw new Error(
        "Message inserted but failed to update last_message_id: " +
          updateError.message
      );
    }
    return { message_id };
  }

  async patchMessage(req: PatchMessageRequest): Promise<PatchMessageResponse> {
    const { chat_id, message_id, ...fields } = req;
    if (!chat_id || !message_id) {
      throw new Error("--chat_id and --message_id are required");
    }
    const { error } = await supabase
      .from("messages")
      .update(fields)
      .eq("chat_id", chat_id)
      .eq("id", message_id);
    if (error) {
      throw new Error("Error patching message: " + error.message);
    }
    return { success: true };
  }

  async deleteMessage(
    req: DeleteMessageRequest
  ): Promise<DeleteMessageResponse> {
    const { chat_id, message_id } = req;
    if (!chat_id || !message_id) {
      throw new Error("--chat_id and --message_id are required");
    }
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("chat_id", chat_id)
      .eq("id", message_id);
    if (error) {
      throw new Error("Error deleting message: " + error.message);
    }
    return { success: true };
  }

  async unreadMessageCount(
    req: UnreadMessageCountRequest
  ): Promise<UnreadMessageCountResponse> {
    const { chat_id, user_id } = req;
    if (!chat_id || !user_id) {
      throw new Error("--chat_id and --user_id are required");
    }
    const { count, error } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("chat_id", chat_id)
      .neq("sender_id", user_id)
      .eq("readed", false);
    if (error) {
      throw new Error("Error counting unread messages: " + error.message);
    }
    return { unread_count: count ?? 0 };
  }

  async addParticipant(
    chatId: string,
    participant: { userId: string; role?: string }
  ): Promise<void> {
    const { error } = await supabase.from("participants").insert([
      {
        chat_id: chatId,
        user_id: participant.userId,
        role: participant.role || "member",
      },
    ]);
    if (error) throw new Error("Error adding participant: " + error.message);
  }

  async removeParticipant(chatId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("participants")
      .delete()
      .eq("chat_id", chatId)
      .eq("user_id", userId);
    if (error) throw new Error("Error removing participant: " + error.message);
  }

  async getParticipants(chatId: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("chat_id", chatId);
    if (error) throw new Error("Error fetching participants: " + error.message);
    // This should be mapped to Profile[] in a real implementation
    return (data || []) as Profile[];
  }

  async markMessageAsRead(
    chatId: string,
    messageId: string,
    userId: string
  ): Promise<void> {
    const { error } = await supabase
      .from("messages")
      .update({
        read_by: supabase.rpc("array_append", {
          arr: "read_by",
          value: userId,
        }),
      })
      .eq("id", messageId)
      .eq("chat_id", chatId);
    if (error)
      throw new Error("Error marking message as read: " + error.message);
  }

  async archiveChat(chatId: string): Promise<void> {
    const { error } = await supabase
      .from("chats")
      .update({ is_archived: true })
      .eq("id", chatId);
    if (error) throw new Error("Error archiving chat: " + error.message);
  }

  async muteChat(chatId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("chats")
      .update({
        muted_by: supabase.rpc("array_append", {
          arr: "muted_by",
          value: userId,
        }),
      })
      .eq("id", chatId);
    if (error) throw new Error("Error muting chat: " + error.message);
  }

  async unmuteChat(chatId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("chats")
      .update({
        muted_by: supabase.rpc("array_remove", {
          arr: "muted_by",
          value: userId,
        }),
      })
      .eq("id", chatId);
    if (error) throw new Error("Error unmuting chat: " + error.message);
  }

  async createWithParticipants(
    chatReq: CreateChatRequest,
    participants: { userId: string; role?: string }[]
  ): Promise<CreateChatResponse> {
    const chatRes = await this.createChat(chatReq);
    for (const participant of participants) {
      await this.addParticipant(chatRes.chat_id, participant);
    }
    return { chat_id: chatRes.chat_id };
  }
}
