import {
  InteractionEntity,
  InteractionEntityParams,
} from "../../domain/entities/Interaction.entity";
import { Interaction as InfraInteraction } from "../../domain/models/interaction";

// Maps infrastructure Interaction model to domain InteractionEntity
export function toDomainInteraction(
  infra: InfraInteraction
): InteractionEntity {
  const params: InteractionEntityParams = {
    id: infra.id,
    swiperUserId: infra.swiper_user_id,
    targetUserId: infra.target_user_id,
    isLiked: infra.is_liked,
    isMatch: infra.is_match,
    createdAt: infra.created_at ?? "",
  };
  return { ...params };
}

// Maps a list of infrastructure interactions to domain entities
export function toDomainInteractionList(
  infras: InfraInteraction[]
): InteractionEntity[] {
  return infras.map(toDomainInteraction);
}
