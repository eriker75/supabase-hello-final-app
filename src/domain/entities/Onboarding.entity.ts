export interface OnboardingEntityParams {
  userId: string;
  profile: any; // Replace 'any' with UserProfileEntity if available
  preferences: any; // Replace 'any' with PreferencesEntity if available
}

/**
 * OnboardingEntity ahora es una interface simple, sin lógica interna.
 */
export interface OnboardingEntity {
  userId: string;
  profile: any;
  preferences: any;
}
