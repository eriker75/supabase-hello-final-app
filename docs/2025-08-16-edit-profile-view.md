# Task: Implement Edit Profile View

## Date

2025-08-16

## Objective

Create a new edit profile view at `/edit` with a layout similar to OnboardingScreenLayout (but without the progress indicator), combining the form fields from onboarding/basicinfo and the image section from onboarding/pictures, as a single-page form. The form should load the current user's data from the store/service and allow updating the profile. The view should be accessible from the "Editar" button in the dashboard profile.

## Action Plan

1. **Documentation & Analysis**
   - Review onboarding and profile files for UI/logic reuse.
   - Identify the correct store and service for user profile data.

2. **Layout**
   - Create `app/edit/_layout.tsx` if missing (simple Stack layout, no progress).
   - Ensure it integrates with the main app layout.

3. **Edit View Implementation**
   - Implement `app/edit/index.tsx`:
     - Use a layout similar to OnboardingScreenLayout, but without progress.
     - Form fields: alias, birth date, bio, gender, interests, age range, and images.
     - Load user data from `currentUserProfileStore` using `UserProfileService`.
     - On submit, call the update service to update the profile.
     - Show a loading indicator and error/success feedback.

4. **Navigation**
   - Ensure the "Editar" button in `app/dashboard/profile/index.tsx` navigates to `/edit`.

5. **Testing**
   - Test the view for correct data loading, editing, and updating.

6. **Documentation**
   - Update this file with implementation notes.
   - Update `devlog.md` with a summary of changes.

## Files to Modify/Create

- `app/edit/_layout.tsx` (new)
- `app/edit/index.tsx`
- `app/dashboard/profile/index.tsx` (ensure navigation)
- `docs/2025-08-16-edit-profile-view.md` (this file)
- `docs/devlog.md` (after completion)

## Observations

- Reuse as much UI and logic from onboarding as possible.
- Ensure the form is a single page with an "Actualizar" button at the end.
- Use the store/service pattern for data loading and updating.
- Follow project documentation and code quality guidelines.
