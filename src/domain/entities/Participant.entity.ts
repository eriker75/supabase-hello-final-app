export interface ParticipantProps {
  id: string;
  userId: string;
  chatId: string;
  role: string;
  joinedAt: Date;
}

/**
 * ParticipantEntity ahora es una interface simple, sin lógica interna.
 */
export interface ParticipantEntity {
  id: string;
  userId: string;
  chatId: string;
  role: string;
  joinedAt: Date;
}
