import { OnboardingEntity } from "@/src/domain/entities/Onboarding.entity";
import { OnboardUserRequest } from "@/src/domain/models/onboarding";
import { OnboardingDatasourceImpl } from "@/src/infraestructure/datasources/OnboardingDatasourceImpl";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";

// Singleton datasource instance
const datasource = new OnboardingDatasourceImpl();

/**
 * useOnboardUser: React Query mutation hook for onboarding a user.
 */
export function useOnboardUser(): UseMutationResult<
  OnboardingEntity,
  unknown,
  OnboardUserRequest
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: OnboardUserRequest) => datasource.onboardUser(req),
    onSuccess: () => {
      queryClient.invalidateQueries(); // Invalidate all queries, or specify if needed
    },
  });
}
