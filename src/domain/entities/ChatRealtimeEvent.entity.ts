import { ChatRealtimeEventType } from "../../definitions/types/ChatRealtimeEvent.type";

/**
 * Represents a realtime chat event, encapsulating all possible event types.
 * Use the `type` property to discriminate the event, and access the relevant payload via getters.
 */
export class ChatRealtimeEventEntity {
  readonly type: ChatRealtimeEventType;

  // Private payloads for each event type (only one will be defined per instance)
  private readonly _message?: {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    createdAt: string;
  };

  private readonly _chat?: {
    id: string;
    name: string;
    creatorId: string;
    createdAt: string;
  };

  private readonly _typing?: {
    chatId: string;
    userId: string;
    isTyping: boolean;
    updatedAt: string;
  };

  private readonly _user?: {
    userId: string;
    isOnline: boolean;
    lastOnline: string;
  };

  private readonly _chatId?: string;
  private readonly _userId?: string;
  private readonly _unreadCount?: number;
  private readonly _updatedAt?: string;

  private constructor(params: {
    type: ChatRealtimeEventType;
    message?: ChatRealtimeEventEntity['_message'];
    chat?: ChatRealtimeEventEntity['_chat'];
    typing?: ChatRealtimeEventEntity['_typing'];
    user?: ChatRealtimeEventEntity['_user'];
    chatId?: string;
    userId?: string;
    unreadCount?: number;
    updatedAt?: string;
  }) {
    this.type = params.type;
    this._message = params.message;
    this._chat = params.chat;
    this._typing = params.typing;
    this._user = params.user;
    this._chatId = params.chatId;
    this._userId = params.userId;
    this._unreadCount = params.unreadCount;
    this._updatedAt = params.updatedAt;
  }

  // Factory methods for each event type
  static newMessage(message: {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    createdAt: string;
  }): ChatRealtimeEventEntity {
    return new ChatRealtimeEventEntity({ type: 'new_message', message });
  }

  static newChat(chat: {
    id: string;
    name: string;
    creatorId: string;
    createdAt: string;
  }): ChatRealtimeEventEntity {
    return new ChatRealtimeEventEntity({ type: 'new_chat', chat });
  }

  static typing(typing: {
    chatId: string;
    userId: string;
    isTyping: boolean;
    updatedAt: string;
  }): ChatRealtimeEventEntity {
    return new ChatRealtimeEventEntity({ type: 'typing', typing });
  }

  static userOnline(user: {
    userId: string;
    isOnline: boolean;
    lastOnline: string;
  }): ChatRealtimeEventEntity {
    return new ChatRealtimeEventEntity({ type: 'user_online', user });
  }

  static unreadCount(params: {
    chatId: string;
    userId: string;
    unreadCount: number;
    updatedAt: string;
  }): ChatRealtimeEventEntity {
    return new ChatRealtimeEventEntity({
      type: 'unread_count',
      chatId: params.chatId,
      userId: params.userId,
      unreadCount: params.unreadCount,
      updatedAt: params.updatedAt,
    });
  }

  // Getters for each event type payload
  getMessage() {
    return this.type === 'new_message' ? this._message : undefined;
  }

  getChat() {
    return this.type === 'new_chat' ? this._chat : undefined;
  }

  getTyping() {
    return this.type === 'typing' ? this._typing : undefined;
  }

  getUser() {
    return this.type === 'user_online' ? this._user : undefined;
  }

  getUnreadCountData() {
    if (this.type === 'unread_count') {
      return {
        chatId: this._chatId,
        userId: this._userId,
        unreadCount: this._unreadCount,
        updatedAt: this._updatedAt,
      };
    }
    return undefined;
  }
}
