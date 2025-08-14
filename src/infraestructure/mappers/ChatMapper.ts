import { ChatEntity, ChatProps } from "@/src/domain/entities/Chat.entity";
import {
  CreateChatRequest,
  Chat as InfraChat,
  ListChatsResponse,
  UpdateChatRequest,
} from "@/src/domain/models/chat";

// Maps infrastructure Chat model to domain ChatEntity
export function toDomainChat(infraChat: InfraChat): ChatEntity {
  // Map infraChat to ChatProps, providing defaults for missing fields
  const props: ChatProps = {
    id: infraChat.id,
    name: infraChat.name,
    type: "private", // Not present in InfraChat, default to "private"
    isActive: true, // Not present in InfraChat, default to true
    description: "", // Not present in InfraChat, default to empty string
    creatorId: infraChat.creator_id,
    participants: [], // Not present in InfraChat, default to empty array
    messages: [], // Not present in InfraChat, default to empty array
    lastMessageId: infraChat.last_message_id ?? infraChat.last_message?.id,
    createdAt: infraChat.created_at
      ? new Date(infraChat.created_at)
      : new Date(),
    updatedAt: infraChat.created_at
      ? new Date(infraChat.created_at)
      : new Date(),
  };
  return { ...props };
}

// Maps domain ChatEntity to infrastructure Chat model (for requests)
export function toInfraCreateChatRequest(
  entity: ChatEntity,
  creatorId: string
): CreateChatRequest {
  return {
    creator_id: creatorId,
    name: entity.name,
    // type is not part of CreateChatRequest, so it is omitted
    // Add description or other fields if needed
  };
}

export function toInfraUpdateChatRequest(
  entity: ChatEntity
): UpdateChatRequest {
  return {
    id: entity.id,
    name: entity.name,
    // Map other properties as needed
  };
}

// Maps a list of infrastructure chats to domain entities
export function toDomainChatList(response: ListChatsResponse): ChatEntity[] {
  return response.chats.map(toDomainChat);
}
