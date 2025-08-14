import { ChatRealtimeEventEntity } from "../../domain/entities/ChatRealtimeEvent.entity";
import {
  InfraChat,
  InfraChatMessage,
  InfraTypingEvent,
  InfraUnreadCountEvent,
  InfraUser,
} from "../../domain/models/chat-realtime";

// Mapper for ChatRealtimeEvent
export function toDomainChatRealtimeEvent(event: any): ChatRealtimeEventEntity {
  switch (event.type) {
    case "new_message": {
      const msg = event.message as InfraChatMessage;
      return ChatRealtimeEventEntity.newMessage({
        id: msg.id,
        chatId: msg.chat_id,
        senderId: msg.sender_id,
        content: msg.content,
        createdAt: msg.created_at,
      });
    }
    case "new_chat": {
      const chat = event.chat as InfraChat;
      return ChatRealtimeEventEntity.newChat({
        id: chat.id,
        name: chat.name,
        creatorId: chat.creator_id,
        createdAt: chat.created_at,
      });
    }
    case "typing": {
      const typing = event.typing as InfraTypingEvent;
      return ChatRealtimeEventEntity.typing({
        chatId: typing.chat_id,
        userId: typing.user_id,
        isTyping: typing.is_typing,
        updatedAt: typing.updated_at,
      });
    }
    case "user_online": {
      const user = event.user as InfraUser;
      return ChatRealtimeEventEntity.userOnline({
        userId: user.id,
        isOnline: user.is_online,
        lastOnline: user.last_online,
      });
    }
    case "unread_count": {
      const unread = event as InfraUnreadCountEvent;
      return ChatRealtimeEventEntity.unreadCount({
        chatId: unread.chat_id,
        userId: unread.user_id,
        unreadCount: unread.unread_count,
        updatedAt: unread.updated_at,
      });
    }
    default:
      throw new Error("Unknown event type");
  }
}
