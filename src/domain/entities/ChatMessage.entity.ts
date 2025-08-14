export interface ChatMessageProps {
  id: string;
  chatId: string;
  content: string;
  draftContent?: string;
  parentId?: string;
  senderId: string;
  recipientId?: string;
  type: string;
  sender: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ChatMessageEntity ahora es una interface simple, sin lógica interna.
 */
export interface ChatMessageEntity {
  id: string;
  chatId: string;
  content: string;
  draftContent?: string;
  parentId?: string;
  senderId: string;
  recipientId?: string;
  type: string;
  sender: string;
  createdAt: Date;
  updatedAt: Date;
}
