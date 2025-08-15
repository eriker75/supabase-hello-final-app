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
/**
 * Maps a UserProfileEntity to a NearbySwipeableProfile for the swipeable profiles store.
 */
import { NearbySwipeableProfile } from "@/src/presentation/stores/nearby-swipeable-profiles.store";

export function toNearbySwipeableProfile(entity: UserProfileEntity): NearbySwipeableProfile {
  return {
    userId: entity.userId,
    profileId: entity.id,
    biography: entity.biography ?? "",
    birthDay: entity.birthDate ? entity.birthDate.toISOString() : "",
    distanceInKm: "", // If available, map here
    age: entity.birthDate
      ? Math.floor(
          (Date.now() - new Date(entity.birthDate).getTime()) /
            (365.25 * 24 * 60 * 60 * 1000)
        )
      : 0,
    gender: entity.gender ?? 0,
    genderInterests: entity.genderInterests ?? [],
    minAgePreference: entity.preferences?.minAge ?? 18,
    maxAgePreference: entity.preferences?.maxAge ?? 98,
    maxDistancePreference: entity.preferences?.maxDistance ?? 200,
    alias: entity.alias ?? "",
    name: entity.name ?? "",
    avatar: entity.avatar ?? "",
    address: entity.address ?? "",
    latitude: entity.latitude?.toString() ?? "",
    longitude: entity.longitude?.toString() ?? "",
    secondaryImages: entity.secondaryImages ?? [],
    isOnline: false,
    isActive: entity.isActive ?? false,
    isOnboarded: entity.isOnboarded ?? false,
    lastOnline: entity.lastOnline ? entity.lastOnline.toISOString() : "",
  };
}
