import {
  OnboardingEntity,
  OnboardingEntityParams,
} from "../../domain/entities/Onboarding.entity";
import { OnboardUserResponse } from "../../domain/models/onboarding";

// Maps infrastructure OnboardUserResponse to domain OnboardingEntity
export function toDomainOnboarding(
  response: OnboardUserResponse
): OnboardingEntity {
  const params: OnboardingEntityParams = {
    userId: response.user_id,
    profile: response.profile, // Replace with toDomainUserProfile if available
    preferences: response.preferences, // Replace with toDomainPreferences if available
  };
  return { ...params };
}
