export interface InteractionEntityParams {
  id: string;
  swiperUserId: string;
  targetUserId: string;
  isLiked: boolean;
  isMatch: boolean;
  createdAt: string;
}

/**
 * InteractionEntity ahora es una interface simple, sin lógica interna.
 */
export interface InteractionEntity {
  id: string;
  swiperUserId: string;
  targetUserId: string;
  isLiked: boolean;
  isMatch: boolean;
  createdAt: string;
}
