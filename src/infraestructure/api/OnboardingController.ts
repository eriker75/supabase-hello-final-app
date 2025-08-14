import { supabase } from "@/src/utils/supabase";
import {
  OnboardUserRequest,
  OnboardUserResponse,
} from "../../domain/models/onboarding";
import { Profile, ProfilePreferences } from "../../domain/models/profile";

/**
 * OnboardingController: Implements onboarding-related data operations as class methods.
 */
export class OnboardingController {
  /**
   * Onboard a user (create or update profile and preferences).
   */
  async onboardUser(req: OnboardUserRequest): Promise<OnboardUserResponse> {
    const {
      email,
      password,
      alias,
      gender,
      avatar,
      biography,
      birth_date,
      is_onboarded = true,
      is_verified = true,
      is_active = true,
      latitude,
      longitude,
      address,
      secondary_images,
      min_age = 18,
      max_age = 98,
      max_distance = 200,
      genders = [1, 2, 3],
    } = req;

    if (!email || !password || !alias || gender === undefined) {
      throw new Error("--email, --password, --alias, and --gender are required");
    }

    // Simulate user creation/authentication and get user_id
    const user_id = "mocked-user-id"; // Replace with actual user creation/auth logic

    // Check if profile already exists
    const { data: existingProfiles, error: checkError } = await supabase
      .from("profiles")
      .select("id, is_onboarded")
      .eq("user_id", user_id);

    if (checkError) {
      throw new Error(
        "Error checking for existing profile: " + checkError.message
      );
    }
    if (existingProfiles && existingProfiles.length > 0) {
      const profileRow = existingProfiles[0];
      if (
        profileRow.is_onboarded === null ||
        profileRow.is_onboarded === false
      ) {
        // Update profile
        const { error: updateProfileError } = await supabase
          .from("profiles")
          .update({
            alias,
            gender,
            avatar: avatar || null,
            biography: biography || null,
            birth_date: birth_date || null,
            is_onboarded: true,
            is_verified,
            is_active,
            latitude: latitude ?? null,
            longitude: longitude ?? null,
            address: address || null,
            secondary_images: secondary_images || null,
          })
          .eq("id", profileRow.id);

        if (updateProfileError) {
          throw new Error(
            "Error updating profile: " + updateProfileError.message
          );
        }

        // Update or insert preferences
        const { data: existingPrefs, error: checkPrefsError } = await supabase
          .from("preferences")
          .select("id")
          .eq("user_id", user_id);

        if (checkPrefsError) {
          throw new Error(
            "Error checking preferences: " + checkPrefsError.message
          );
        }

        const preferencesFields: ProfilePreferences = {
          user_id,
          min_age,
          max_age,
          max_distance,
          genders,
        };

        if (existingPrefs && existingPrefs.length > 0) {
          // Update
          const { error: updatePrefsError } = await supabase
            .from("preferences")
            .update(preferencesFields)
            .eq("user_id", user_id);
          if (updatePrefsError) {
            throw new Error(
              "Error updating preferences: " + updatePrefsError.message
            );
          }
        } else {
          // Insert
          const { error: insertPrefsError } = await supabase
            .from("preferences")
            .insert([preferencesFields]);
          if (insertPrefsError) {
            throw new Error(
              "Error creating preferences: " + insertPrefsError.message
            );
          }
        }

        // Get updated profile
        const { data: updatedProfile, error: getProfileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", profileRow.id);

        if (getProfileError || !updatedProfile || updatedProfile.length === 0) {
          throw new Error(
            "Error fetching updated profile: " +
              (getProfileError?.message || "Unknown error")
          );
        }

        // Get updated preferences
        const { data: updatedPrefs, error: getPrefsError } = await supabase
          .from("preferences")
          .select("*")
          .eq("user_id", user_id);

        if (getPrefsError || !updatedPrefs || updatedPrefs.length === 0) {
          throw new Error(
            "Error fetching updated preferences: " +
              (getPrefsError?.message || "Unknown error")
          );
        }

        return {
          user_id,
          profile: updatedProfile[0] as Profile,
          preferences: updatedPrefs[0] as ProfilePreferences,
        };
      } else {
        throw new Error(
          "Profile already exists for this user and is already onboarded. Onboarding is idempotent."
        );
      }
    }

    // 1. Create profile
    const profileFields: Profile = {
      id: "mocked-id", // Replace with actual id from DB
      user_id,
      alias,
      gender,
      avatar: avatar || null,
      biography: biography || null,
      birth_date: birth_date || null,
      is_onboarded,
      is_verified,
      is_active,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      address: address || null,
      last_online: null,
      is_online: null,
      location: null,
      secondary_images: secondary_images || null,
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
      min_age,
      max_age,
      max_distance,
      genders,
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
      user_id: profile.user_id,
      profile,
      preferences: preferencesFields,
    };
  }
}
