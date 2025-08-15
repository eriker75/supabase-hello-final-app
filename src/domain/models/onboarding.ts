import { Profile } from "./profile";

export interface OnboardUserRequest {
  user_id: string; // UUID del usuario autenticado
  alias: string;
  gender: number;
  avatar?: string;
  biography?: string;
  birth_date?: string;
  is_onboarded?: boolean;
  is_verified?: boolean;
  is_active?: boolean;
  latitude?: number;
  longitude?: number;
  address?: string;
  secondary_images?: string[];
  min_age?: number;
  max_age?: number;
  max_distance?: number;
  genders?: number[];
}

export interface ProfilePreferences {
  id?: string;
  user_id: string;
  min_age: number;
  max_age: number;
  max_distance: number;
  genders: number[] | string;
}

export interface OnboardUserResponse {
  user_id: string;
  profile: Profile;
  preferences: ProfilePreferences;
}
