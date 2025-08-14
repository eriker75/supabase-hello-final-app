export interface CreateChatRequest {
  creator_id: string;
  name?: string;
  type: "group" | "private";
  description?: string;
  participants: string[];
}

export interface CreateChatResponse {
  chat_id: string;
}

export interface ListChatsRequest {
  page?: number;
  perPage?: number;
  user_id?: string;
}

export interface ListChatsResponse {
  chats: Chat[];
  page: number;
  perPage: number;
  total: number;
  hasMore: boolean;
}

export interface Chat {
  id: string;
  name: string;
  creator_id: string;
  created_at?: string;
  last_message_id?: string;
  last_message?: Message;
  other_profile?: Profile;
}

export interface GetChatRequest {
  id: string;
}
export interface GetChatResponse {
  chat: any;
}

export interface UpdateChatRequest {
  id: string;
  name?: string;
  type?: string;
  is_active?: string;
  description?: string;
}

export interface UpdateChatResponse {
  success: boolean;
}

export interface DeleteChatRequest {
  id: string;
}
export interface DeleteChatResponse {
  success: boolean;
}

export interface ListMessagesRequest {
  chat_id: string;
  page?: number;
  perPage?: number;
  user_id?: string;
}

export interface ListMessagesResponse {
  messages: Message[];
  page: number;
  perPage: number;
  total: number;
  hasMore: boolean;
  chat_id: string;
  other_profile?: Profile;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at?: string;
  type?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  alias: string;
  avatar?: string;
}

export interface GetMessageRequest {
  chat_id: string;
  message_id: string;
}
export interface GetMessageResponse {
  message: any;
}

export interface PostMessageRequest {
  chat_id: string;
  sender_id: string;
  content: string;
  type: string;
}

export interface PostMessageResponse {
  message_id: string;
}

export interface PatchMessageRequest {
  chat_id: string;
  message_id: string;
  content?: string;
}

export interface PatchMessageResponse {
  success: boolean;
}

export interface DeleteMessageRequest {
  chat_id: string;
  message_id: string;
}
export interface DeleteMessageResponse {
  success: boolean;
}

export interface UnreadMessageCountRequest {
  chat_id: string;
  user_id: string;
}

export interface UnreadMessageCountResponse {
  unread_count: number;
}
