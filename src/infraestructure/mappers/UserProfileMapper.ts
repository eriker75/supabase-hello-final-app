import {
  UserProfileEntity,
  UserProfileProps,
} from "@/src/domain/entities/UserProfile.entity";
import {
  Profile,
  ProfilePreferences,
  ProfileResponse,
} from "@/src/domain/models/profile";

// Maps infrastructure ProfileResponse to domain UserProfileEntity
export function toDomainUserProfile(
  profileResponse: ProfileResponse
): UserProfileEntity {
  const profile: Profile = profileResponse.profile;
  const preferences: ProfilePreferences | null = profileResponse.preferences;

  const params: UserProfileProps = {
    id: profile.id,
    userId: profile.user_id,
    name: "", // Not present, set to empty or enrich elsewhere
    email: "", // Not present, set to empty or enrich elsewhere
    alias: profile.alias ?? "",
    biography: profile.biography ?? "",
    birthDate: profile.birth_date ? new Date(profile.birth_date) : undefined,
    gender: profile.gender ?? 0,
    genderInterests: preferences?.genders
      ? Array.isArray(preferences.genders)
        ? preferences.genders.map(String)
        : [String(preferences.genders)]
      : [],
    avatar: profile.avatar ?? "",
    secondaryImages: profile.secondary_images ?? [],
    address: profile.address ?? "",
    lastOnline: undefined, // Not present in Profile, set to undefined or enrich elsewhere
    latitude: profile.latitude ?? 0,
    longitude: profile.longitude ?? 0,
    isOnboarded: profile.is_onboarded ?? false,
    isActive: profile.is_active ?? false,
    isVerified: profile.is_verified ?? false,
    createdAt: new Date(), // Not present in Profile, set to now or enrich elsewhere
    updatedAt: new Date(), // Not present in Profile, set to now or enrich elsewhere
    preferences: preferences
      ? {
          minAge: preferences.min_age ?? 0,
          maxAge: preferences.max_age ?? 0,
          maxDistance: preferences.max_distance ?? 0,
          genders: preferences.genders
            ? Array.isArray(preferences.genders)
              ? preferences.genders.map(String)
              : [String(preferences.genders)]
            : [],
        }
      : undefined,
  };

  return { ...params };
}

// Maps a list of ProfileResponse to domain UserProfileEntity[]
export function toDomainUserProfileList(
  responses: ProfileResponse[]
): UserProfileEntity[] {
  return responses.map(toDomainUserProfile);
}
