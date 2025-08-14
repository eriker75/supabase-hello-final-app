import { supabase } from "@/src/utils/supabase";
import { Match } from "../../domain/models/match";
import { Profile, SwipeableProfile } from "../../domain/models/profile";

export class UserLocationController {
  /**
   * List nearby profiles.
   */
  async listNearbyProfiles(req: {
    user_id: string;
    maxDistance?: number;
  }): Promise<{ profiles: Profile[] }> {
    const { user_id, maxDistance = 50.0 } = req;

    if (!user_id) {
      throw new Error('❌ user_id is required for "nearby"');
    }

    // Call nearby_profiles
    const { data, error } = await supabase.rpc("nearby_profiles", {
      user_id,
      max_distance: maxDistance,
    });

    if (error) {
      throw new Error("Error fetching nearby profiles: " + error.message);
    }

    return { profiles: (data || []) as Profile[] };
  }

  /**
   * List swipeable profiles.
   */
  async listNearbySwipeableProfiles(req: {
    user_id: string;
    maxDistance?: number;
    count?: number;
  }): Promise<{ profiles: SwipeableProfile[] }> {
    const { user_id, maxDistance = 50.0, count = 10 } = req;

    if (!user_id) {
      throw new Error('❌ user_id is required for "swipeable"');
    }

    // Call swipeable_profiles
    const { data, error } = await supabase.rpc("swipeable_profiles", {
      user_id,
      max_distance: maxDistance,
      limit_count: count,
    });

    if (error) {
      throw new Error("Error fetching swipeable profiles: " + error.message);
    }

    return { profiles: (data || []) as SwipeableProfile[] };
  }

  /**
   * List nearby matches.
   */
  async listNearbyMatches(req: {
    user_id: string;
    maxDistance?: number;
  }): Promise<{ matches: Match[] }> {
    const { user_id, maxDistance = 200.0 } = req;

    if (!user_id) {
      throw new Error('❌ user_id is required for "nearby-matches"');
    }

    // Call nearby_matches
    const { data, error } = await supabase.rpc("nearby_matches", {
      user_id,
      max_distance: maxDistance,
    });

    if (error) {
      throw new Error("Error fetching nearby matches: " + error.message);
    }

    return { matches: (data || []) as Match[] };
  }

  /**
   * Find a user location by userId.
   */
  async findByUserId(userId: string): Promise<{ user_id: string; latitude: number; longitude: number; updated_at?: string } | null> {
    const { data, error } = await supabase
      .from("user_locations")
      .select("*")
      .eq("user_id", userId)
      .limit(1);
    if (error || !data || data.length === 0) return null;
    return data[0] as { user_id: string; latitude: number; longitude: number; updated_at?: string };
  }

  /**
   * Update a user's location.
   */
  async updateLocation(
    userId: string,
    latitude: number,
    longitude: number
  ): Promise<{ user_id: string; latitude: number; longitude: number; updated_at?: string }> {
    const { data, error } = await supabase
      .from("user_locations")
      .upsert([{ user_id: userId, latitude, longitude }], {
        onConflict: "user_id",
      })
      .select();
    if (error || !data || data.length === 0)
      throw new Error(
        "Error updating location: " + (error?.message || "Unknown error")
      );
    return data[0] as { user_id: string; latitude: number; longitude: number; updated_at?: string };
  }

  /**
   * Delete a user's location.
   */
  async delete(userId: string): Promise<void> {
    const { error } = await supabase
      .from("user_locations")
      .delete()
      .eq("user_id", userId);
    if (error)
      throw new Error("Error deleting user location: " + error.message);
  }
}
