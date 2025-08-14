import { ChatMessageEntity } from "./ChatMessage.entity";
import { ParticipantEntity } from "./Participant.entity";

export interface ChatProps {
  id: string;
  name: string;
  type: "private" | "groupal";
  isActive: boolean;
  description?: string;
  creatorId: string;
  participants: ParticipantEntity[];
  messages: ChatMessageEntity[];
  lastMessageId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ChatEntity ahora es una interface simple, sin lógica interna.
 * Métodos mutadores deben ser gestionados externamente.
 */
export interface ChatEntity {
  id: string;
  name: string;
  type: "private" | "groupal";
  isActive: boolean;
  description?: string;
  creatorId: string;
  participants: ParticipantEntity[];
  messages: ChatMessageEntity[];
  lastMessageId?: string;
  createdAt: Date;
  updatedAt: Date;
}
