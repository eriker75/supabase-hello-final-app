export interface ListMatchesRequest {
  user_id: string;
  maxDistance?: number;
}

export interface ListMatchesResponse {
  matches: any[];
}
