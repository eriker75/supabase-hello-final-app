import { InteractionEntity } from "../entities/Interaction.entity";
import { ListMatchesRequest } from "../models/match";
import { CreateSwipeRequest, ListSwipesRequest } from "../models/swipe";

/**
 * AbstractInteractionDatasource: contract for domain/application use.
 */
export abstract class AbstractInteractionDatasource {
  abstract listMatches(req: ListMatchesRequest): Promise<InteractionEntity[]>;
  abstract createSwipe(req: CreateSwipeRequest): Promise<InteractionEntity>;
  abstract listSwipes(req: ListSwipesRequest): Promise<InteractionEntity[]>;
}
