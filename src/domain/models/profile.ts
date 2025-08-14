export interface Profile {
  id: string;
  user_id: string;
  alias: string | null;
  gender: number | null;
  avatar: string | null;
  biography: string | null;
  birth_date: string | null;
  is_onboarded: boolean | null;
  is_verified: boolean | null;
  is_active: boolean | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  secondary_images: any | null;
}

export interface ProfilePreferences {
  id?: string;
  user_id: string;
  min_age: number;
  max_age: number;
  max_distance: number;
  genders: number[] | string;
}

export interface ProfileResponse {
  id: string;
  profile: Profile;
  preferences: ProfilePreferences | null;
}

export interface ProfileListResponse {
  profiles: ProfileResponse[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface CreateProfileRequest {
  user_id: string;
  alias?: string;
  gender?: number;
  avatar?: string;
  biography?: string;
  birth_date?: string;
  is_onboarded?: boolean;
  is_verified?: boolean;
  is_active?: boolean;
  latitude?: number;
  longitude?: number;
  address?: string;
  secondary_images?: any;
  min_age?: number;
  max_age?: number;
  max_distance?: number;
  genders?: number[] | string;
}

export interface UpdateProfileRequest {
  id: string;
  user_id?: string;
  alias?: string;
  gender?: number;
  avatar?: string;
  biography?: string;
  birth_date?: string;
  is_onboarded?: boolean;
  is_verified?: boolean;
  is_active?: boolean;
  latitude?: number;
  longitude?: number;
  address?: string;
  secondary_images?: any;
  min_age?: number;
  max_age?: number;
  max_distance?: number;
  genders?: number[] | string;
}

export interface GetProfileRequest {
  id: string;
}

export interface DeleteProfileRequest {
  id: string;
  user_id?: string;
}

export interface ListProfilesRequest {
  limit: number;
  offset: number;
}
