import { supabase } from "@/src/utils/supabase";
import {
  ListMatchesRequest,
  ListMatchesResponse,
  Match,
} from "../../domain/models/match";
import {
  CreateSwipeRequest,
  CreateSwipeResponse,
  ListSwipesRequest,
  ListSwipesResponse,
  Swipe,
} from "../../domain/models/swipe";

/**
 * InteractionController: Implements interaction-related data operations as class methods.
 */
export class InteractionController {
  /**
   * List matches using the nearby_matches RPC.
   */
  async listMatches(req: ListMatchesRequest): Promise<ListMatchesResponse> {
    const { user_id, maxDistance } = req;

    if (!user_id) {
      throw new Error('❌ user_id is required for "list"');
    }

    // Call nearby_matches RPC (uses interactions table)
    const { data, error } = await supabase.rpc("nearby_matches", {
      user_id,
      max_distance: maxDistance ?? 200.0,
    });

    if (error) {
      throw new Error("❌ Error fetching matches: " + error.message);
    }

    // Enrich and type the matches
    const matches: Match[] = (data || []) as Match[];
    return { matches };
  }

  /**
   * Create a swipe (interaction)
   */
  async createSwipe(req: CreateSwipeRequest): Promise<CreateSwipeResponse> {
    const { user_id, target_user_id, is_liked } = req;

    if (!user_id) {
      throw new Error("❌ user_id is required for 'post'");
    }
    if (!target_user_id || typeof is_liked === "undefined") {
      throw new Error("❌ target_user_id and is_liked are required for 'post'");
    }

    // Insert swipe (interaction)
    const { data, error } = await supabase
      .from("interactions")
      .insert([
        {
          swiper_user_id: user_id,
          target_user_id,
          is_liked: is_liked === true,
        },
      ])
      .select();

    if (error || !data || data.length === 0) {
      throw new Error(
        "❌ Error creating swipe: " + (error?.message || "Unknown error")
      );
    }

    return { swipe: data[0] as Swipe };
  }

  /**
   * List swipes (interactions)
   */
  async listSwipes(req: ListSwipesRequest): Promise<ListSwipesResponse> {
    const { user_id, target_user_id, is_liked } = req;

    if (!user_id) {
      throw new Error("❌ user_id is required for 'list'");
    }

    // Build query
    let query = supabase
      .from("interactions")
      .select("*")
      .eq("swiper_user_id", user_id);

    if (target_user_id) {
      query = query.eq("target_user_id", target_user_id);
    }
    if (typeof is_liked !== "undefined") {
      query = query.eq("is_liked", is_liked === true);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      throw new Error("❌ Error listing swipes: " + error.message);
    }

    return { swipes: (data || []) as Swipe[] };
  }
}
