export interface Swipe {
  created_at: string;
  swiper_user_id: string;
  target_user_id: string;
  is_liked: boolean;
  is_match: boolean;
  id: string;
}

export interface CreateSwipeRequest {
  user_id: string;
  target_user_id: string;
  is_liked: boolean;
}

export interface CreateSwipeResponse {
  swipe: Swipe;
}

export interface ListSwipesRequest {
  user_id: string;
  target_user_id?: string;
  is_liked?: boolean;
}

export interface ListSwipesResponse {
  swipes: Swipe[];
}
