# 2025-08-15 - Refactor onboarding/index.tsx to use correct stores and validation

## Context

The onboarding view (`app/onboarding/index.tsx`) was using outdated imports and store APIs:

- Imported `useOnboardingStore` and `useAuthUserProfileStore` from incorrect module paths.
- Used a `validateCurrentStep` method that no longer exists in the onboarding store.
- Did not use the new validation helper or the correct onboarding/auth store structure.

## Action Plan

- Update imports to use the correct store hooks from `src/presentation/stores/`.
- Use the `validateOnboardingStep` helper from `src/utils/validateOnboardingStep.ts` for step validation.
- Ensure the redirect logic uses the correct `isOnboarded` property from the auth store.
- Remove all usage of the obsolete `validateCurrentStep` method.

## Files Modified

- `app/onboarding/index.tsx`

## Observations

- The onboarding store and auth store now follow a consistent, modern Zustand pattern.
- Validation logic is centralized in a helper, improving maintainability and testability.
- The view is now robust to future store refactors and matches the current project architecture.

## Next Steps

- Update `docs/devlog.md` with a summary of this change.
- Test onboarding flow to ensure correct behavior.
