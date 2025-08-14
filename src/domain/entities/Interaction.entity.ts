export interface InteractionEntityParams {
  id: string;
  swiperUserId: string;
  targetUserId: string;
  isLiked: boolean;
  isMatch: boolean;
  createdAt: string;
}

export class InteractionEntity {
  id: string;
  swiperUserId: string;
  targetUserId: string;
  isLiked: boolean;
  isMatch: boolean;
  createdAt: string;

  constructor(params: InteractionEntityParams) {
    this.id = params.id;
    this.swiperUserId = params.swiperUserId;
    this.targetUserId = params.targetUserId;
    this.isLiked = params.isLiked;
    this.isMatch = params.isMatch;
    this.createdAt = params.createdAt;
  }
}
