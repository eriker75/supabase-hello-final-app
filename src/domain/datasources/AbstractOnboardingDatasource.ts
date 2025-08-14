import { OnboardingEntity } from "../entities/Onboarding.entity";
import { OnboardUserRequest } from "../models/onboarding";

/**
 * AbstractOnboardingDatasource: contract for domain/application use.
 */
export abstract class AbstractOnboardingDatasource {
  abstract onboardUser(req: OnboardUserRequest): Promise<OnboardingEntity>;
}
