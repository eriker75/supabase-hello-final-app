export interface UserProfile {
  id?: string;
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

export interface UserPreferences {
  id?: string;
  user_id: string;
  min_age: number;
  max_age: number;
  max_distance: number;
  genders: number[] | string;
}

export interface UserResponse {
  user_id: string;
  profile: UserProfile;
  preferences: UserPreferences | null;
}

export interface UserListResponse {
  users: UserResponse[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface CreateUserRequest {
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

export interface UpdateUserRequest {
  id: string;
  email?: string;
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

export interface GetUserRequest {
  id: string;
}

export interface DeleteUserRequest {
  id: string;
}

export interface ListUsersRequest {
  limit: number;
  offset: number;
}

export interface MeUserRequest {
  user_id: string;
}
