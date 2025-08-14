export interface InfraChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface InfraChat {
  id: string;
  name: string;
  creator_id: string;
  created_at: string;
}

export interface InfraTypingEvent {
  chat_id: string;
  user_id: string;
  is_typing: boolean;
  updated_at: string;
}

export interface InfraUser {
  id: string;
  is_online: boolean;
  last_online: string;
}

export interface InfraUnreadCountEvent {
  chat_id: string;
  user_id: string;
  unread_count: number;
  updated_at: string;
}
