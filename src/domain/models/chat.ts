import { Profile } from "./profile";

export interface CreateChatRequest {
  name: string;
  creator_id: string;
}

export interface CreateChatResponse {
  chat_id: string;
}

export interface ListChatsRequest {
  page?: number;
  perPage?: number;
  user_id?: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at?: string;
  type?: string;
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

export interface ListChatsResponse {
  chats: Chat[];
  page: number;
  perPage: number;
  total: number;
  hasMore: boolean;
}

export interface GetChatRequest {
  id: string;
  user_id?: string;
}

export interface GetChatResponse {
  chat: Chat;
  other_profile?: Profile;
}

export interface UpdateChatRequest {
  id: string;
  name?: string;
  is_active?: boolean;
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

export interface GetMessageRequest {
  chat_id: string;
  message_id: string;
  user_id?: string;
}

export interface GetMessageResponse {
  message: Message;
  other_profile?: Profile;
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

export interface MarkAllMessagesReadRequest {
  chat_id: string;
  user_id: string;
}

export interface MarkAllMessagesReadResponse {
  success: boolean;
  updated_count: number;
}
