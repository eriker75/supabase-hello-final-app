# Task: Refactor Profile View to Use Dynamic Data from Service and Store

**Date:** 2025-08-15

## Objective

Modify `app/dashboard/profile/[id]/index.tsx` so that it displays the visited user's profile using dynamic data from the backend service, leveraging the current-user-profile store for fast, fluid rendering. The view should:

- Use the pre-set current-user-profile from the store for instant initial render.
- On mount, fetch the visited user's profile by id, update the store, and re-render with any new/missing data.

## Action Plan

1. Analyze the current implementation and identify how profile data is fetched and stored.
2. Refactor the component to:
   - Use the current-user-profile store for initial render.
   - On mount, fetch the profile for the visited user id using the service and update the store.
   - Render from the store, so the UI updates automatically when the store is updated.
3. Document the change and update the development log.

## Implementation Details

- The store used is `currentUserProfileStore` from `src/presentation/stores/current-user-profile.store.ts`.
- The service used is `useGetUserProfileByIdService` from `src/infraestructure/services/UserProfileService.ts`.
- The view now uses the store for initial render and updates the store with fresh data on mount.
- The implementation assumes that overwriting the current-user-profile store with the visited user's profile is acceptable for this use case. If not, a separate store or local state should be considered.

## Files Modified

- `app/dashboard/profile/[id]/index.tsx`

## Observations

- This approach provides a fast, fluid user experience by leveraging the store for instant render and updating with fresh data as soon as it is available.
- Overwriting the current-user-profile store may have side effects if the user navigates back to their own profile. Consider a dedicated "visited profile" store for a more robust solution in the future.
