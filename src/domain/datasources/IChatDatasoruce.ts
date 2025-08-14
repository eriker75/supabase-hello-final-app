import { ChatEntity } from "../entities/Chat.entity";
import { ChatMessageEntity } from "../entities/ChatMessage.entity";
import { ParticipantEntity } from "../entities/Participant.entity";

/**
 * Chat Datasoruce contract for domain/application use.
 */
/**
 * IChatDatasoruce ahora es una clase abstracta.
 */
export abstract class IChatDatasoruce {
  // CRUD
  abstract findById(id: string): Promise<ChatEntity | null>;
  abstract findAll(): Promise<ChatEntity[]>;
  abstract save(entity: ChatEntity): Promise<void>;
  abstract update(entity: ChatEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
  // Finders
  abstract findByParticipant(userId: string): Promise<ChatEntity[]>;
  abstract findByType(type: string): Promise<ChatEntity[]>;
  abstract findActiveChats(userId: string): Promise<ChatEntity[]>;
  abstract findArchivedChats(userId: string): Promise<ChatEntity[]>;
  abstract findMutedChats(userId: string): Promise<ChatEntity[]>;
  abstract findChatsWithUnreadMessages(userId: string): Promise<ChatEntity[]>;
  // Participants
  abstract createWithParticipants(chat: ChatEntity, participants: ParticipantEntity[]): Promise<ChatEntity>;
  abstract addParticipant(chatId: string, participant: ParticipantEntity): Promise<void>;
  abstract removeParticipant(chatId: string, userId: string): Promise<void>;
  abstract getParticipants(chatId: string): Promise<ParticipantEntity[]>;
  // Messages
  abstract getMessages(chatId: string): Promise<ChatMessageEntity[]>;
  abstract sendMessage(chatId: string, message: ChatMessageEntity): Promise<ChatMessageEntity>;
  abstract markMessageAsRead(chatId: string, messageId: string, userId: string): Promise<void>;
  // Chat activity
  abstract archiveChat(chatId: string): Promise<void>;
  abstract muteChat(chatId: string, userId: string): Promise<void>;
  abstract unmuteChat(chatId: string, userId: string): Promise<void>;
}
