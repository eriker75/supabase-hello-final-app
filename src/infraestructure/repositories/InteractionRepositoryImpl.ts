import { InteractionEntity } from "@/src/domain/entities/Interaction.entity";
import { ListMatchesRequest } from "@/src/domain/models/match";
import {
  CreateSwipeRequest,
  ListSwipesRequest,
} from "@/src/domain/models/swipe";
import { InteractionDatasourceImpl } from "@/src/infraestructure/datasources/InteractionDatasourceImp";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

// Singleton datasource instance
const datasource = new InteractionDatasourceImpl();

/**
 * useListMatches: React Query query hook for listing matches.
 */
export function useListMatches(
  req: ListMatchesRequest
): UseQueryResult<InteractionEntity[]> {
  return useQuery({
    queryKey: ["interaction", "listMatches", req],
    queryFn: () => datasource.listMatches(req),
    enabled: !!req?.user_id,
  });
}

/**
 * useCreateSwipe: React Query mutation hook for creating a swipe.
 */
export function useCreateSwipe(): UseMutationResult<
  InteractionEntity,
  unknown,
  CreateSwipeRequest
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: CreateSwipeRequest) => datasource.createSwipe(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interaction"] });
    },
  });
}

/**
 * useListSwipes: React Query query hook for listing swipes.
 */
export function useListSwipes(
  req: ListSwipesRequest
): UseQueryResult<InteractionEntity[]> {
  return useQuery({
    queryKey: ["interaction", "listSwipes", req],
    queryFn: () => datasource.listSwipes(req),
    enabled: !!req?.user_id,
  });
}
