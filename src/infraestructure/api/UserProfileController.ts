import { supabase } from "@/src/utils/supabase";
import {
  CreateProfileRequest,
  DeleteProfileRequest,
  GetProfileRequest,
  ListProfilesRequest,
  Profile,
  ProfileListResponse,
  ProfilePreferences,
  ProfileResponse,
  SwipeableProfile,
  SwipeableProfilesResponse,
  UpdateProfileRequest,
} from "../../domain/models/profile";
import {
  CreateUserRequest,
  DeleteUserRequest,
  GetUserRequest,
  ListUsersRequest,
  MeUserRequest,
  UpdateUserRequest,
  UserListResponse,
  UserPreferences,
  UserProfile,
  UserResponse,
} from "../../domain/models/user";

/**
 * UserProfileController: Implements user and profile data operations as class methods.
 */
export class UserProfileController {
  /**
   * Create a new user, profile, and preferences
   */
  async createUser(req: CreateUserRequest): Promise<UserResponse> {
    const { email, password, ...rest } = req;
    if (!email || !password) {
      throw new Error("--email and --password are required");
    }

    // 1. Create user in auth.users (simulate, as this is not implemented here)
    const user_id = "mocked-user-id"; // Replace with actual user creation logic

    // 2. Create profile
    const profileFields: Partial<UserProfile> = {
      user_id,
      alias: rest.alias ?? null,
      gender: rest.gender ?? null,
      avatar: rest.avatar ?? null,
      biography: rest.biography ?? null,
      birth_date: rest.birth_date ?? null,
      is_onboarded: rest.is_onboarded ?? false,
      is_verified: rest.is_verified ?? true,
      is_active: rest.is_active ?? true,
      latitude: rest.latitude ?? null,
      longitude: rest.longitude ?? null,
      address: rest.address ?? null,
      secondary_images: rest.secondary_images ?? null,
    };

    const { error: profileError } = await supabase
      .from("profiles")
      .insert([profileFields]);
    if (profileError) {
      throw new Error("Error creating profile: " + profileError.message);
    }

    // 3. Create preferences
    const preferencesFields: UserPreferences = {
      user_id,
      min_age: rest.min_age ?? 18,
      max_age: rest.max_age ?? 98,
      max_distance: rest.max_distance ?? 200,
      genders: rest.genders ? rest.genders : [1, 2, 3],
    };

    const { error: preferencesError } = await supabase
      .from("preferences")
      .insert([preferencesFields]);
    if (preferencesError) {
      throw new Error(
        "Error creating preferences: " + preferencesError.message
      );
    }

    return {
      user_id,
      profile: profileFields as UserProfile,
      preferences: preferencesFields,
    };
  }

  /**
   * List users with profile and preferences, paginated
   */
  async listUsers(req: ListUsersRequest): Promise<UserListResponse> {
    const { limit, offset } = req;

    // 1. Get profiles with pagination
    const {
      data: profiles,
      error,
      count,
    } = await supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error("Error listing users: " + error.message);
    }

    // 2. For each profile, get preferences by user_id
    const users: UserResponse[] = await Promise.all(
      (profiles || []).map(async (profile: UserProfile) => {
        const { data: preferencesArr, error: prefError } = await supabase
          .from("preferences")
          .select("*")
          .eq("user_id", profile.user_id)
          .limit(1);

        if (prefError) {
          throw new Error("Error fetching preferences: " + prefError.message);
        }

        return {
          user_id: profile.user_id,
          profile,
          preferences:
            preferencesArr && preferencesArr.length > 0
              ? preferencesArr[0] as UserPreferences
              : null,
        };
      })
    );

    return {
      users,
      pagination: {
        limit,
        offset,
        total: count ?? users.length,
      },
    };
  }

  /**
   * Get user by id with profile and preferences
   */
  async getUser(req: GetUserRequest): Promise<UserResponse> {
    const user_id = req.id;
    if (!user_id) {
      throw new Error("--id is required");
    }

    // 1. Get profile
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      throw new Error("Error getting user: " + error.message);
    }
    if (!profiles || profiles.length === 0) {
      throw new Error("No profile found for user_id: " + user_id);
    }
    const profile = profiles[0] as UserProfile;

    // 2. Get preferences
    const { data: preferencesArr, error: prefError } = await supabase
      .from("preferences")
      .select("*")
      .eq("user_id", user_id)
      .limit(1);

    if (prefError) {
      throw new Error("Error fetching preferences: " + prefError.message);
    }

    return {
      user_id: profile.user_id,
      profile,
      preferences:
        preferencesArr && preferencesArr.length > 0
          ? preferencesArr[0] as UserPreferences
          : null,
    };
  }

  /**
   * Get "me" user by email and password
   */
  async getMeUser(req: MeUserRequest): Promise<UserResponse> {
    const { email, password } = req;
    if (!email || !password) {
      throw new Error('--email and --password are required for "me"');
    }
    // Simulate user_id retrieval
    const user_id = "mocked-user-id";

    // 4. Get profile
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      throw new Error("Error obteniendo perfil: " + error.message);
    }
    if (!profiles || profiles.length === 0) {
      throw new Error("No se encontró perfil para el usuario autenticado");
    }
    const profile = profiles[0] as UserProfile;

    // 5. Get preferences
    const { data: preferencesArr, error: prefError } = await supabase
      .from("preferences")
      .select("*")
      .eq("user_id", user_id)
      .limit(1);

    if (prefError) {
      throw new Error("Error obteniendo preferencias: " + prefError.message);
    }

    return {
      user_id: profile.user_id,
      profile,
      preferences:
        preferencesArr && preferencesArr.length > 0
          ? preferencesArr[0] as UserPreferences
          : null,
    };
  }

  /**
   * Update user, profile, and/or preferences
   */
  async updateUser(req: UpdateUserRequest): Promise<void> {
    const user_id = req.id;
    if (!user_id) {
      throw new Error("--id is required");
    }

    // Update profile fields if provided
    const profileFields: Partial<UserProfile> = {};
    const allowedProfileFields: (keyof UserProfile)[] = [
      "alias",
      "gender",
      "avatar",
      "biography",
      "birth_date",
      "is_onboarded",
      "is_verified",
      "is_active",
      "latitude",
      "longitude",
      "address",
      "secondary_images",
    ];
    for (const field of allowedProfileFields) {
      if (
        Object.prototype.hasOwnProperty.call(req, field) &&
        (req as any)[field] !== undefined
      ) {
        (profileFields as any)[field] = (req as any)[field];
      }
    }
    if (Object.keys(profileFields).length > 0) {
      const { error } = await supabase
        .from("profiles")
        .update(profileFields)
        .eq("user_id", user_id);
      if (error) {
        throw new Error("Error updating profile: " + error.message);
      }
    }

    // Update preferences if provided
    const preferencesFields: Partial<UserPreferences> = {};
    const allowedPreferencesFields: (keyof UserPreferences)[] = [
      "min_age",
      "max_age",
      "max_distance",
      "genders",
    ];
    for (const field of allowedPreferencesFields) {
      if (
        Object.prototype.hasOwnProperty.call(req, field) &&
        (req as any)[field] !== undefined
      ) {
        (preferencesFields as any)[field] = (req as any)[field];
      }
    }
    if (Object.keys(preferencesFields).length > 0) {
      const { error } = await supabase
        .from("preferences")
        .update(preferencesFields)
        .eq("user_id", user_id);
      if (error) {
        throw new Error("Error updating preferences: " + error.message);
      }
    }

    // Update user email if provided (optional, not joined in response)
    if (req.email) {
      const { error } = await supabase.auth.admin.updateUserById(user_id, {
        email: req.email,
      });
      if (error) {
        throw new Error("Error updating user email: " + error.message);
      }
    }
  }

  /**
   * Delete user, profile, and preferences
   */
  async deleteUser(req: DeleteUserRequest): Promise<void> {
    const user_id = req.id;
    if (!user_id) {
      throw new Error("--id is required");
    }

    // Delete preferences
    const { error: preferencesError } = await supabase
      .from("preferences")
      .delete()
      .eq("user_id", user_id);
    if (preferencesError) {
      throw new Error(
        "Error deleting preferences: " + preferencesError.message
      );
    }

    // Delete profile
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("user_id", user_id);
    if (profileError) {
      throw new Error("Error deleting profile: " + profileError.message);
    }

    // Delete user from auth
    const { error: userError } = await supabase.auth.admin.deleteUser(user_id);
    if (userError) {
      throw new Error("Error deleting user: " + userError.message);
    }
  }

  // Profile service functions
  /**
   * Create a new profile and preferences.
   */
  async createProfile(req: CreateProfileRequest): Promise<ProfileResponse> {
    const {
      user_id,
      alias,
      gender,
      avatar,
      biography,
      birth_date,
      is_onboarded,
      is_verified,
      is_active,
      latitude,
      longitude,
      address,
      secondary_images,
      min_age,
      max_age,
      max_distance,
      genders,
    } = req;

    if (!user_id) {
      throw new Error("--user_id is required");
    }

    // 1. Create profile
    const profileFields: Partial<Profile> = {
      user_id,
      alias: alias ?? null,
      gender: gender ?? null,
      avatar: avatar ?? null,
      biography: biography ?? null,
      birth_date: birth_date ?? null,
      is_onboarded: is_onboarded ?? false,
      is_verified: is_verified ?? true,
      is_active: is_active ?? true,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      address: address ?? null,
      secondary_images: secondary_images ?? null,
    };

    const { data: insertedProfiles, error: profileError } = await supabase
      .from("profiles")
      .insert([profileFields])
      .select();

    if (profileError || !insertedProfiles || insertedProfiles.length === 0) {
      throw new Error(
        "Error creating profile: " + (profileError?.message || "Unknown error")
      );
    }

    const profile = insertedProfiles[0] as Profile;

    // 2. Create preferences
    const preferencesFields: ProfilePreferences = {
      user_id: profile.user_id,
      min_age: min_age ?? 18,
      max_age: max_age ?? 98,
      max_distance: max_distance ?? 200,
      genders: genders ? genders : [1, 2, 3],
    };

    const { error: preferencesError } = await supabase
      .from("preferences")
      .insert([{ ...preferencesFields, user_id: profile.user_id }]);

    if (preferencesError) {
      throw new Error(
        "Error creating preferences: " + preferencesError.message
      );
    }

    return {
      id: profile.id,
      profile,
      preferences: preferencesFields,
    };
  }

  /**
   * List profiles with preferences, paginated.
   */
  async listProfiles(req: ListProfilesRequest): Promise<ProfileListResponse> {
    const { limit, offset } = req;

    // 1. Get profiles with pagination
    const {
      data: profiles,
      error,
      count,
    } = await supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error("Error listing profiles: " + error.message);
    }

    // 2. For each profile, get preferences by profile id
    const profileResponses: ProfileResponse[] = await Promise.all(
      (profiles || []).map(async (profile: Profile) => {
        const { data: preferencesArr, error: prefError } = await supabase
          .from("preferences")
          .select("*")
          .eq("user_id", profile.user_id)
          .limit(1);

        if (prefError) {
          throw new Error("Error fetching preferences: " + prefError.message);
        }

        return {
          id: profile.id,
          profile,
          preferences:
            preferencesArr && preferencesArr.length > 0
              ? preferencesArr[0] as ProfilePreferences
              : null,
        };
      })
    );

    return {
      profiles: profileResponses,
      pagination: {
        limit,
        offset,
        total: count ?? profileResponses.length,
      },
    };
  }

  /**
   * Get profile by id with preferences.
   */
  async getProfile(req: GetProfileRequest): Promise<ProfileResponse> {
    const profile_id = req.id;
    if (!profile_id) {
      throw new Error("--id is required");
    }

    // 1. Get profile
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profile_id);

    if (error) {
      throw new Error("Error getting profile: " + error.message);
    }
    if (!profiles || profiles.length === 0) {
      throw new Error("No profile found for id: " + profile_id);
    }
    const profile = profiles[0] as Profile;

    // 2. Get preferences
    const { data: preferencesArr, error: prefError } = await supabase
      .from("preferences")
      .select("*")
      .eq("user_id", profile.user_id)
      .limit(1);

    if (prefError) {
      throw new Error("Error fetching preferences: " + prefError.message);
    }

    return {
      id: profile.id,
      profile,
      preferences:
        preferencesArr && preferencesArr.length > 0
          ? preferencesArr[0] as ProfilePreferences
          : null,
    };
  }

  /**
   * Update profile and/or preferences by profile id.
   */
  async updateProfile(req: UpdateProfileRequest): Promise<void> {
    const profile_id = req.id;
    if (!profile_id) {
      throw new Error("--id is required");
    }

    // Update profile fields if provided
    const profileFields: Partial<Profile> = {};
    const allowedProfileFields: (keyof Profile)[] = [
      "alias",
      "gender",
      "avatar",
      "biography",
      "birth_date",
      "is_onboarded",
      "is_verified",
      "is_active",
      "latitude",
      "longitude",
      "address",
      "secondary_images",
    ];
    for (const field of allowedProfileFields) {
      if (
        Object.prototype.hasOwnProperty.call(req, field) &&
        (req as any)[field] !== undefined
      ) {
        (profileFields as any)[field] = (req as any)[field];
      }
    }
    if (Object.keys(profileFields).length > 0) {
      const { error } = await supabase
        .from("profiles")
        .update(profileFields)
        .eq("id", profile_id);
      if (error) {
        throw new Error("Error updating profile: " + error.message);
      }
    }

    // Update preferences if provided
    const preferencesFields: Partial<ProfilePreferences> = {};
    const allowedPreferencesFields: (keyof ProfilePreferences)[] = [
      "min_age",
      "max_age",
      "max_distance",
      "genders",
    ];
    for (const field of allowedPreferencesFields) {
      if (
        Object.prototype.hasOwnProperty.call(req, field) &&
        (req as any)[field] !== undefined
      ) {
        (preferencesFields as any)[field] = (req as any)[field];
      }
    }
    if (Object.keys(preferencesFields).length > 0) {
      const { error } = await supabase
        .from("preferences")
        .update(preferencesFields)
        .eq("user_id", req.user_id);
      if (error) {
        throw new Error("Error updating preferences: " + error.message);
      }
    }
  }

  /**
   * Delete profile and preferences by profile id.
   */
  async deleteProfile(req: DeleteProfileRequest): Promise<void> {
    const profile_id = req.id;
    if (!profile_id) {
      throw new Error("--id is required");
    }

    // Delete preferences if user_id is provided
    if (req.user_id) {
      const { error: preferencesError } = await supabase
        .from("preferences")
        .delete()
        .eq("user_id", req.user_id);
      if (preferencesError) {
        throw new Error(
          "Error deleting preferences: " + preferencesError.message
        );
      }
    }

    // Delete profile
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", profile_id);
    if (profileError) {
      throw new Error("Error deleting profile: " + profileError.message);
    }
  }

  /**
   * List nearby profiles.
   */
  async listNearbyProfiles(req: {
    user_id: string;
    maxDistance?: number;
  }): Promise<{ profiles: Profile[] }> {
    const { user_id, maxDistance = 50.0 } = req;
    if (!user_id) throw new Error('user_id is required for "nearby"');
    const { data, error } = await supabase.rpc("nearby_profiles", {
      user_id,
      max_distance: maxDistance,
    });
    if (error)
      throw new Error("Error fetching nearby profiles: " + error.message);
    return { profiles: (data || []) as Profile[] };
  }

  /**
   * List swipeable profiles.
   */
  async listNearbySwipeableProfiles(req: {
    user_id: string;
    maxDistance?: number;
    count?: number;
  }): Promise<SwipeableProfilesResponse> {
    const { user_id, maxDistance = 50.0, count = 10 } = req;
    if (!user_id) throw new Error('user_id is required for "swipeable"');
    const { data, error } = await supabase.rpc("swipeable_profiles", {
      user_id,
      max_distance: maxDistance,
      limit_count: count,
    });
    if (error)
      throw new Error("Error fetching swipeable profiles: " + error.message);
    return { profiles: (data || []) as SwipeableProfile[] };
  }

  /**
   * List nearby matches.
   */
  async listNearbyMatches(req: {
    user_id: string;
    maxDistance?: number;
  }): Promise<{ matches: any[] }> {
    const { user_id, maxDistance = 200.0 } = req;
    if (!user_id) throw new Error('user_id is required for "nearby-matches"');
    const { data, error } = await supabase.rpc("nearby_matches", {
      user_id,
      max_distance: maxDistance,
    });
    if (error)
      throw new Error("Error fetching nearby matches: " + error.message);
    return { matches: data || [] };
  }

  /**
   * Find a profile by email.
   */
  async findByEmail(email: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .limit(1);
    if (error || !data || data.length === 0) return null;
    return data[0] as Profile;
  }

  /**
   * Find a profile by alias.
   */
  async findByAlias(alias: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("alias", alias)
      .limit(1);
    if (error || !data || data.length === 0) return null;
    return data[0] as Profile;
  }

  /**
   * Get preferences for a user.
   */
  async getPreferences(userId: string): Promise<ProfilePreferences | null> {
    const { data, error } = await supabase
      .from("preferences")
      .select("*")
      .eq("user_id", userId)
      .limit(1);
    if (error || !data || data.length === 0) return null;
    return data[0] as ProfilePreferences;
  }

  /**
   * Set preferences for a user.
   */
  async setPreferences(userId: string, preferences: ProfilePreferences): Promise<void> {
    const { error } = await supabase
      .from("preferences")
      .update(preferences)
      .eq("user_id", userId);
    if (error) throw new Error("Error updating preferences: " + error.message);
  }

  /**
   * Update user location.
   */
  async updateLocation(
    userId: string,
    latitude: number,
    longitude: number
  ): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({ latitude, longitude })
      .eq("user_id", userId);
    if (error) throw new Error("Error updating location: " + error.message);
  }

  /**
   * Block a user.
   */
  async blockUser(blockerId: string, blockedId: string): Promise<void> {
    const { error } = await supabase
      .from("blocks")
      .insert([{ blocker_id: blockerId, blocked_id: blockedId }]);
    if (error) throw new Error("Error blocking user: " + error.message);
  }

  /**
   * Report a user.
   */
  async reportUser(
    reporterId: string,
    reportedId: string,
    reason: string,
    details?: string
  ): Promise<void> {
    const { error } = await supabase
      .from("reports")
      .insert([
        { reporter_id: reporterId, reported_id: reportedId, reason, details },
      ]);
    if (error) throw new Error("Error reporting user: " + error.message);
  }

  /**
   * Set user online.
   */
  async setOnline(userId: string): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({ is_online: true })
      .eq("user_id", userId);
    if (error) throw new Error("Error setting user online: " + error.message);
  }

  /**
   * Set user offline.
   */
  async setOffline(userId: string): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({ is_online: false })
      .eq("user_id", userId);
    if (error) throw new Error("Error setting user offline: " + error.message);
  }
}
