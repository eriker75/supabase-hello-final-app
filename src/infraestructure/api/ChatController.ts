import { supabase } from "@/src/utils/supabase";
import {
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
  PatchMessageRequest,
  PatchMessageResponse,
  PostMessageRequest,
  PostMessageResponse,
  UnreadMessageCountRequest,
  UnreadMessageCountResponse,
  UpdateChatRequest,
  UpdateChatResponse,
} from "../../domain/models/chat";

/**
 * ChatController: Implements chat-related data operations as class methods.
 */
export class ChatController {
  /**
   * Create a new chat.
   */
  async createChat(req: CreateChatRequest): Promise<CreateChatResponse> {
    const { name, description, type, creator_id } = req;
    if (!creator_id) {
      throw new Error("param creator_id is required");
    }

    const { data, error } = await supabase
      .from("chats")
      .insert([{ name, creator_id, type, description }])
      .select();

    if (error || !data || data.length === 0) {
      throw new Error(
        "Error creating chat: " + (error?.message || "Unknown error")
      );
    }

    return { chat_id: data[0].id };
  }

  /**
   * List all chats. -> if user_id is provided list all chats of the that user
   */
  async listChats(req: ListChatsRequest): Promise<ListChatsResponse> {
    const page = req.page && req.page > 0 ? req.page : 1;
    const perPage = req.perPage && req.perPage > 0 ? req.perPage : 20;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

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

      const chatIds = (participantRows || []).map((row: any) => row.chat_id);

      // If no chats, return empty result
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

      const total = chatIds.length;
      const hasMore = to + 1 < total;

      // Enrich chats with last_message
      let chats = data || [];
      const lastMessageIds = chats
        .map((chat: any) => chat.last_message_id)
        .filter((id: string | undefined) => !!id);

      let lastMessagesMap: Record<string, any> = {};
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
            lastMessages.map((msg: any) => [msg.id, msg])
          );
        }
      }
      chats = chats.map((chat: any) => ({
        ...chat,
        last_message: chat.last_message_id
          ? lastMessagesMap[chat.last_message_id]
          : undefined,
      }));

      let otherUserIds: string[] = [];
      if (req.user_id) {
        // For each private chat, find the other participant
        for (const chat of chats) {
          if (chat.type === "private") {
            // Fetch participants for this chat
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
                chat._other_user_id = other.user_id; // temp for mapping
              } else {
                chat._other_user_id = undefined;
              }
            } else {
              chat._other_user_id = undefined;
            }
          } else {
            chat._other_user_id = undefined;
          }
        }
      }

      // Fetch all needed profiles in one query
      let profilesMap: Record<string, any> = {};
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
          // Deduplicate: only use the first profile for each user_id
          const uniqueProfiles: Record<string, any> = {};
          for (const prof of profiles) {
            if (!uniqueProfiles[prof.user_id]) {
              uniqueProfiles[prof.user_id] = prof;
            }
          }
          profilesMap = uniqueProfiles;
        }
      }

      chats = chats.map((chat: any) => {
        let other_profile = undefined;
        if (chat.type === "private") {
          if (chat._other_user_id) {
            other_profile = profilesMap[chat._other_user_id];
          }
        }
        if ("_other_user_id" in chat) {
          delete chat._other_user_id;
        }
        return {
          ...chat,
          last_message: chat.last_message_id
            ? lastMessagesMap[chat.last_message_id]
            : undefined,
          other_profile:
            chat.type === "private" && other_profile
              ? {
                  ...other_profile,
                  secondary_images: other_profile.secondary_images,
                }
              : undefined,
        };
      });

      return {
        chats,
        page,
        perPage,
        total,
        hasMore,
      };
    } else {
      // Global chat listing
      const { data, error, count } = await supabase
        .from("chats")
        .select("*", { count: "exact" })
        .range(from, to);

      if (error) {
        throw new Error("Error listing chats: " + error.message);
      }

      const total = typeof count === "number" ? count : 0;
      const hasMore = to + 1 < total;

      // Enrich chats with last_message
      let chats = data || [];
      const lastMessageIds = chats
        .map((chat: any) => chat.last_message_id)
        .filter((id: string | undefined) => !!id);

      let lastMessagesMap: Record<string, any> = {};
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
            lastMessages.map((msg: any) => [msg.id, msg])
          );
        }
      }

      // Enrich private chats with other_profile
      let otherUserIds: string[] = [];
      if (req.user_id) {
        // For each private chat, find the other participant
        for (const chat of chats) {
          if (chat.type === "private") {
            // Fetch participants for this chat
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
                chat._other_user_id = other.user_id; // temp for mapping
              } else {
                // If both participants are the same (shouldn't happen), still set undefined
                chat._other_user_id = undefined;
              }
            } else {
              // Not exactly 2 participants, set undefined
              chat._other_user_id = undefined;
            }
          } else {
            chat._other_user_id = undefined;
          }
        }
      }

      // Fetch all needed profiles in one query
      let profilesMap: Record<string, any> = {};
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
            profiles.map((prof: any) => [prof.user_id, prof])
          );
        }
      }

      chats = chats.map((chat: any) => {
        let other_profile = undefined;
        if (chat.type === "private" && chat._other_user_id) {
          other_profile = profilesMap[chat._other_user_id];
        }
        // Remove temp field
        if (chat._other_user_id) {
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
        chats,
        page,
        perPage,
        total,
        hasMore,
      };
    }
  }

  /**
   * Get chat by id.
   */
  async getChat(req: GetChatRequest): Promise<GetChatResponse> {
    const { id } = req;
    if (!id) {
      throw new Error("--id is required");
    }

    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("id", id);

    if (error) {
      throw new Error("Error getting chat: " + error.message);
    }
    if (!data || data.length === 0) {
      throw new Error("No chat found for id: " + id);
    }

    return { chat: data[0] };
  }

  /**
   * Update chat by id.
   */
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

  /**
   * Delete chat by id.
   */
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

  /**
   * List messages in a chat.
   */
  async listMessages(req: ListMessagesRequest): Promise<ListMessagesResponse> {
    const { chat_id, page, perPage, user_id } = req;
    if (!chat_id) {
      throw new Error("--chat_id is required");
    }

    const pageNum = page && page > 0 ? page : 1;
    const perPageNum = perPage && perPage > 0 ? perPage : 20;
    const from = (pageNum - 1) * perPageNum;
    const to = from + perPageNum - 1;

    // Get paginated messages and total count
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

    // Fetch chat to determine if private and get participants
    const { data: chatRows, error: chatError } = await supabase
      .from("chats")
      .select("*")
      .eq("id", chat_id);

    if (chatError || !chatRows || chatRows.length === 0) {
      throw new Error(
        "Error fetching chat for message listing: " +
          (chatError?.message || "Not found")
      );
    }

    // Fetch participants
    const { data: participants, error: partError } = await supabase
      .from("participants")
      .select("user_id")
      .eq("chat_id", chat_id);

    if (partError) {
      throw new Error("Error fetching chat participants: " + partError.message);
    }

    let other_profile = undefined;
    if (participants && participants.length === 2) {
      // Private chat: get the other participant's user_id
      let otherUserId = participants[0].user_id;
      if (user_id && participants[0].user_id === user_id) {
        otherUserId = participants[1].user_id;
      } else if (user_id && participants[1].user_id === user_id) {
        otherUserId = participants[0].user_id;
      }
      // Fetch profile for the other user
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
        other_profile = profiles[0];
      }
    }

    return {
      messages: messages || [],
      page: pageNum,
      perPage: perPageNum,
      total,
      hasMore,
      chat_id,
      other_profile,
    };
  }

  /**
   * Get message by id.
   */
  async getMessage(req: GetMessageRequest): Promise<GetMessageResponse> {
    const { chat_id, message_id } = req;
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

    return { message: data[0] };
  }

  /**
   * Post message to chat.
   */
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

  /**
   * Patch (update) message.
   */
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

  /**
   * Delete message.
   */
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

  /**
   * Get unread message count for a user in a chat.
   */
  async unreadMessageCount(
    req: UnreadMessageCountRequest
  ): Promise<UnreadMessageCountResponse> {
    const { chat_id, user_id } = req;
    if (!chat_id || !user_id) {
      throw new Error("--chat_id and --user_id are required");
    }

    // Assumes messages table has fields: chat_id, sender_id, is_read, and recipient_id or similar
    // This query counts messages in the chat not sent by the user and not marked as read by the user
    const { count, error } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("chat_id", chat_id)
      .neq("sender_id", user_id)
      .or(`is_read.eq.false,read_by_user_id.eq.${user_id}`);

    if (error) {
      throw new Error("Error counting unread messages: " + error.message);
    }

    return { unread_count: count ?? 0 };
  }
  /**
   * Add a participant to a chat.
   */
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

  /**
   * Remove a participant from a chat.
   */
  async removeParticipant(chatId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("participants")
      .delete()
      .eq("chat_id", chatId)
      .eq("user_id", userId);
    if (error) throw new Error("Error removing participant: " + error.message);
  }

  /**
   * Get participants for a chat.
   */
  async getParticipants(chatId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("chat_id", chatId);
    if (error) throw new Error("Error fetching participants: " + error.message);
    return data || [];
  }

  /**
   * Mark a message as read by a user.
   */
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

  /**
   * Archive a chat.
   */
  async archiveChat(chatId: string): Promise<void> {
    const { error } = await supabase
      .from("chats")
      .update({ is_archived: true })
      .eq("id", chatId);
    if (error) throw new Error("Error archiving chat: " + error.message);
  }

  /**
   * Mute a chat for a user.
   */
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

  /**
   * Unmute a chat for a user.
   */
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

  /**
   * Create a chat and add participants.
   */
  async createWithParticipants(
    chatReq: CreateChatRequest,
    participants: { userId: string; role?: string }[]
  ): Promise<any> {
    const chatRes = await this.createChat(chatReq);
    const chatId = chatRes.chat_id;
    for (const participant of participants) {
      await this.addParticipant(chatId, participant);
    }
    return { chat_id: chatId };
  }
}
