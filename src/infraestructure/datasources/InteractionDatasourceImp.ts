import { InteractionController } from "@/src/infraestructure/api/InteractionController";
import {
  toDomainInteraction,
  toDomainInteractionList,
} from "@/src/infraestructure/mappers/InteractionMapper";
import { InteractionEntity } from "../../domain/entities/Interaction.entity";
import {
  ListMatchesRequest,
  ListMatchesResponse,
} from "../../domain/models/match";
import {
  CreateSwipeRequest,
  CreateSwipeResponse,
  ListSwipesRequest,
  ListSwipesResponse,
} from "../../domain/models/swipe";

/**
 * InteractionDatasourceImpl: Implements interaction-related data operations as class methods, delegating to InteractionController and using mappers.
 */
export class InteractionDatasourceImpl {
  private controller: InteractionController;

  constructor() {
    this.controller = new InteractionController();
  }

  async listMatches(req: ListMatchesRequest): Promise<InteractionEntity[]> {
    const res: ListMatchesResponse = await this.controller.listMatches(req);
    if (!res.matches) return [];
    // Map Match[] to Interaction[] by extracting or defaulting required fields
    const interactions = res.matches.map((match) => ({
      id: match.id,
      swiper_user_id: req.user_id, // The requesting user is the swiper
      target_user_id: match.user_id, // The matched user is the target
      is_liked: true, // A match means both users liked each other
      is_match: true, // By definition, this is a match
      created_at: match.matched_at ?? match.created_at ?? "",
    }));
    return toDomainInteractionList(interactions);
  }

  async createSwipe(req: CreateSwipeRequest): Promise<InteractionEntity> {
    const res: CreateSwipeResponse = await this.controller.createSwipe(req);
    return toDomainInteraction(res.swipe);
  }

  async listSwipes(req: ListSwipesRequest): Promise<InteractionEntity[]> {
    const res: ListSwipesResponse = await this.controller.listSwipes(req);
    if (!res.swipes) return [];
    return toDomainInteractionList(res.swipes);
  }
}
