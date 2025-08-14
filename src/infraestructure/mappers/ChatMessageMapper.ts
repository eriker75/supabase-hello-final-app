import { ChatMessageEntity } from "@/src/domain/entities/ChatMessage.entity";
import { Message } from "@/src/domain/models/chat";

// Maps infrastructure Message model to domain ChatMessageEntity
export function toDomainChatMessage(infraMsg: Message): ChatMessageEntity {
  const params = {
    id: infraMsg.id,
    chatId: infraMsg.chat_id,
    content: infraMsg.content,
    draftContent: "", // Not present in infra, default to empty
    parentId: (infraMsg as any).parent_id ?? "", // If present, else empty
    senderId: infraMsg.sender_id,
    recipientId: (infraMsg as any).recipient_id ?? "", // If present, else empty
    type: (infraMsg.type as any) ?? "text", // Default to "text" if not present
    sender: (infraMsg as any).sender ?? "other", // Default, adjust as needed
    createdAt: infraMsg.created_at ? new Date(infraMsg.created_at) : new Date(),
    updatedAt: (infraMsg as any).updated_at
      ? new Date((infraMsg as any).updated_at)
      : new Date(),
  };
  return new ChatMessageEntity(params);
}

// Maps a list of infrastructure messages to domain entities
export function toDomainChatMessageList(
  messages: Message[]
): ChatMessageEntity[] {
  return messages.map(toDomainChatMessage);
}
