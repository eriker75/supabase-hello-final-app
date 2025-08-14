
/**
 * Represents a realtime chat event, encapsulating all possible event types.
 * Use the `type` property to discriminate the event, and access the relevant payload via getters.
 */
/**
 * ChatRealtimeEventEntity ahora es un tipo discriminado por 'type'.
 * Las factorías se exportan como funciones puras.
 */

export type ChatRealtimeEventEntity =
  | { type: 'new_message'; message: { id: string; chatId: string; senderId: string; content: string; createdAt: string } }
  | { type: 'new_chat'; chat: { id: string; name: string; creatorId: string; createdAt: string } }
  | { type: 'typing'; typing: { chatId: string; userId: string; isTyping: boolean; updatedAt: string } }
  | { type: 'user_online'; user: { userId: string; isOnline: boolean; lastOnline: string } }
  | { type: 'unread_count'; chatId: string; userId: string; unreadCount: number; updatedAt: string };

/** Factorías puras para cada tipo de evento */
export function newMessageEvent(message: { id: string; chatId: string; senderId: string; content: string; createdAt: string }): ChatRealtimeEventEntity {
  return { type: 'new_message', message };
}
export function newChatEvent(chat: { id: string; name: string; creatorId: string; createdAt: string }): ChatRealtimeEventEntity {
  return { type: 'new_chat', chat };
}
export function typingEvent(typing: { chatId: string; userId: string; isTyping: boolean; updatedAt: string }): ChatRealtimeEventEntity {
  return { type: 'typing', typing };
}
export function userOnlineEvent(user: { userId: string; isOnline: boolean; lastOnline: string }): ChatRealtimeEventEntity {
  return { type: 'user_online', user };
}
export function unreadCountEvent(params: { chatId: string; userId: string; unreadCount: number; updatedAt: string }): ChatRealtimeEventEntity {
  return { type: 'unread_count', ...params };
}
