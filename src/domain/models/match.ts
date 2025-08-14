import { Profile, ProfilePreferences } from "./profile";

export interface ListMatchesRequest {
  user_id: string;
  maxDistance?: number;
}

export interface Match {
  user_id: string;
  username: string;
  avatar_url: string | null;
  latitude: number | null;
  longitude: number | null;
  distance_km: number | null;
  matched_at: string | null;
  has_chat: boolean;

  id: string;
  created_at: string;
  updated_at: string;
  alias: string | null;
  biography: string | null;
  birth_date: string | null;
  gender: number | null;
  avatar: string | null;
  address: string | null;
  last_online: string | null;
  is_onboarded: boolean | null;
  is_verified: boolean | null;
  is_online: boolean | null;
  is_active: boolean | null;
  location: string | null;
  secondary_images: string[] | null;

  preferences: ProfilePreferences | null;
  profile: Profile;
}

export interface ListMatchesResponse {
  matches: Match[];
}
