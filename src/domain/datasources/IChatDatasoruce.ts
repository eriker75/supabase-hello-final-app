import { ChatEntity } from "../entities/Chat.entity";
import { ChatMessageEntity } from "../entities/ChatMessage.entity";
import { ParticipantEntity } from "../entities/Participant.entity";

/**
 * Chat Datasoruce contract for domain/application use.
 */
export interface IChatDatasoruce {
  // CRUD
  findById(id: string): Promise<ChatEntity | null>;
  findAll(): Promise<ChatEntity[]>;
  save(entity: ChatEntity): Promise<void>;
  update(entity: ChatEntity): Promise<void>;
  delete(id: string): Promise<void>;
  // Finders
  findByParticipant(userId: string): Promise<ChatEntity[]>;
  findByType(type: string): Promise<ChatEntity[]>;
  findActiveChats(userId: string): Promise<ChatEntity[]>;
  findArchivedChats(userId: string): Promise<ChatEntity[]>;
  findMutedChats(userId: string): Promise<ChatEntity[]>;
  findChatsWithUnreadMessages(userId: string): Promise<ChatEntity[]>;
  // Participants
  createWithParticipants(chat: ChatEntity, participants: ParticipantEntity[]): Promise<ChatEntity>;
  addParticipant(chatId: string, participant: ParticipantEntity): Promise<void>;
  removeParticipant(chatId: string, userId: string): Promise<void>;
  getParticipants(chatId: string): Promise<ParticipantEntity[]>;
  // Messages
  getMessages(chatId: string): Promise<ChatMessageEntity[]>;
  sendMessage(chatId: string, message: ChatMessageEntity): Promise<ChatMessageEntity>;
  markMessageAsRead(chatId: string, messageId: string, userId: string): Promise<void>;
  // Chat activity
  archiveChat(chatId: string): Promise<void>;
  muteChat(chatId: string, userId: string): Promise<void>;
  unmuteChat(chatId: string, userId: string): Promise<void>;
}
