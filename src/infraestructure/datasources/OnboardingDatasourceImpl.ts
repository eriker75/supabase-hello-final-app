import { OnboardingController } from "@/src/infraestructure/api/OnboardingController";
import { toDomainOnboarding } from "@/src/infraestructure/mappers/OnboardingMapper";
import { OnboardingEntity } from "../../domain/entities/Onboarding.entity";
import {
  OnboardUserRequest,
  OnboardUserResponse,
} from "../../domain/models/onboarding";

/**
 * OnboardingDatasourceImpl: Implements onboarding-related
 * data operations as class methods, delegating to
 * OnboardingController and using mappers.
 */
export class OnboardingDatasourceImpl {
  private controller: OnboardingController;

  constructor() {
    this.controller = new OnboardingController();
  }

  async onboardUser(req: OnboardUserRequest): Promise<OnboardingEntity> {
    const response: OnboardUserResponse = await this.controller.onboardUser(
      req
    );
    return toDomainOnboarding(response);
  }
}
