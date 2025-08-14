export interface OnboardingEntityParams {
  userId: string;
  profile: any; // Replace 'any' with UserProfileEntity if available
  preferences: any; // Replace 'any' with PreferencesEntity if available
}

export class OnboardingEntity {
  userId: string;
  profile: any;
  preferences: any;

  constructor(params: OnboardingEntityParams) {
    this.userId = params.userId;
    this.profile = params.profile;
    this.preferences = params.preferences;
  }
}
