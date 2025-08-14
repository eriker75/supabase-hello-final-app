import { IChatDatasoruce } from "@/src/domain/datasources/IChatDatasoruce";
import { ChatEntity } from "@/src/domain/entities/Chat.entity";
import { ChatMessageEntity } from "@/src/domain/entities/ChatMessage.entity";
import {
  toDomainChat,
  toDomainChatList,
  toInfraCreateChatRequest,
  toInfraUpdateChatRequest,
} from "@/src/infraestructure/mappers/ChatMapper";
import {
  toDomainChatMessage,
  toDomainChatMessageList,
} from "@/src/infraestructure/mappers/ChatMessageMapper";
import { ParticipantEntity } from "../../domain/entities/Participant.entity";
import { ChatController } from "../api/ChatController";

export class ChatDatasourceImpl implements IChatDatasoruce {
  private controller: ChatController;

  constructor() {
    this.controller = new ChatController();
  }

  async findById(id: string): Promise<ChatEntity | null> {
    const res = await this.controller.getChat({ id });
    return res && res.chat ? toDomainChat(res.chat) : null;
  }

  async findAll(): Promise<ChatEntity[]> {
    const res = await this.controller.listChats({});
    return toDomainChatList(res);
  }

  async save(entity: ChatEntity): Promise<void> {
    await this.controller.createChat(
      toInfraCreateChatRequest(entity, entity.creatorId)
    );
  }

  async update(entity: ChatEntity): Promise<void> {
    await this.controller.updateChat(toInfraUpdateChatRequest(entity));
  }

  async delete(id: string): Promise<void> {
    await this.controller.deleteChat({ id });
  }

  async findByParticipant(userId: string): Promise<ChatEntity[]> {
    const res = await this.controller.listChats({ user_id: userId });
    return toDomainChatList(res);
  }

  async findByType(type: string): Promise<ChatEntity[]> {
    const res = await this.controller.listChats({});
    return toDomainChatList(res).filter((chat) => chat.type === type);
  }

  async findActiveChats(userId: string): Promise<ChatEntity[]> {
    const res = await this.controller.listChats({ user_id: userId });
    return toDomainChatList(res).filter((chat) => chat.isActive);
  }

  async findArchivedChats(userId: string): Promise<ChatEntity[]> {
    const res = await this.controller.listChats({ user_id: userId });
    return toDomainChatList(res).filter((chat) => !chat.isActive);
  }

  async findMutedChats(userId: string): Promise<ChatEntity[]> {
    // Muted chats not supported in domain entity; return empty array or implement if infra supports
    return [];
  }

  async findChatsWithUnreadMessages(userId: string): Promise<ChatEntity[]> {
    const res = await this.controller.listChats({ user_id: userId });
    const chats = toDomainChatList(res);
    const result: ChatEntity[] = [];
    for (const chat of chats) {
      const unread = await this.controller.unreadMessageCount({
        chat_id: chat.id,
        user_id: userId,
      });
      if (unread.unread_count > 0) {
        result.push(chat);
      }
    }
    return result;
  }

  async createWithParticipants(
    chat: ChatEntity,
    participants: ParticipantEntity[]
  ): Promise<ChatEntity> {
    const chatReq = toInfraCreateChatRequest(chat, chat.creatorId);
    const participantObjs = participants.map((p) => ({
      userId: p.userId,
      role: p.role,
    }));
    const chatRes = await this.controller.createWithParticipants(chatReq, participantObjs);
    const res = await this.controller.getChat({ id: chatRes.chat_id });
    if (!res || !res.chat)
      throw new Error("Failed to create chat with participants");
    return toDomainChat(res.chat);
  }

  async addParticipant(
    chatId: string,
    participant: ParticipantEntity
  ): Promise<void> {
    await this.controller.addParticipant(chatId, {
      userId: participant.userId,
      role: participant.role,
    });
  }

  async removeParticipant(chatId: string, userId: string): Promise<void> {
    await this.controller.removeParticipant(chatId, userId);
  }

  async getParticipants(chatId: string): Promise<ParticipantEntity[]> {
    const data = await this.controller.getParticipants(chatId);
    return (data || []).map(
      (row: any) =>
        new ParticipantEntity({
          id: row.id ?? `${row.chat_id}_${row.user_id}`,
          userId: row.user_id,
          chatId: row.chat_id,
          role: row.role,
          joinedAt: row.joined_at ? new Date(row.joined_at) : new Date(),
        })
    );
  }

  async getMessages(chatId: string): Promise<ChatMessageEntity[]> {
    const res = await this.controller.listMessages({ chat_id: chatId });
    return toDomainChatMessageList(res.messages);
  }

  async sendMessage(
    chatId: string,
    message: ChatMessageEntity
  ): Promise<ChatMessageEntity> {
    const res = await this.controller.postMessage({
      chat_id: chatId,
      sender_id: message.senderId,
      content: message.content,
      type: message.type || "text",
    });
    const msgRes = await this.controller.getMessage({
      chat_id: chatId,
      message_id: res.message_id,
    });
    return toDomainChatMessage(msgRes.message);
  }

  async markMessageAsRead(
    chatId: string,
    messageId: string,
    userId: string
  ): Promise<void> {
    await this.controller.markMessageAsRead(chatId, messageId, userId);
  }

  async archiveChat(chatId: string): Promise<void> {
    await this.controller.archiveChat(chatId);
  }

  async muteChat(chatId: string, userId: string): Promise<void> {
    await this.controller.muteChat(chatId, userId);
  }

  async unmuteChat(chatId: string, userId: string): Promise<void> {
    await this.controller.unmuteChat(chatId, userId);
  }
}
