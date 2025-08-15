# Refactor: Centralize Google Logout Logic in useGoogleAuth

**Date:** 2025-08-15  
**Status:** completed

## Context

The logout button was not working as expected. The logout logic was spread between a custom `useLogout` hook and the Google login hook. The requirement was to centralize all logout logic in a single hook (`useGoogleAuth`), ensuring that:

- The store is cleaned,
- The user is logged out from Supabase,
- The user is logged out from Google using `GoogleSignin`,
- The user is redirected to the login view.

## Action Plan

1. Analyze the current `useGoogleLogin` and `useLogout` hooks.
2. Rename `useGoogleLogin` to `useGoogleAuth` and refactor it to include all logout logic.
3. Implement the logout logic: clean store, Supabase sign out, Google sign out, and redirect to `/login`.
4. Update all usages of the old hooks in the codebase (notably in `app/dashboard/swipe.tsx`).
5. Remove the obsolete `useLogout.ts` file.
6. Document the changes in `/docs` and update `devlog.md`.

## Files Modified

- `src/presentation/hooks/useGoogleLogin.ts` → `src/presentation/hooks/useGoogleAuth.ts`
- `app/dashboard/swipe.tsx`
- `src/presentation/hooks/useLogout.ts` (deleted)
- `docs/2025-08-15-refactor-google-auth-logout.md` (this file)
- `docs/devlog.md` (to be updated)

## Observations

- The new `useGoogleAuth` hook now handles all authentication and logout logic, including navigation.
- The logout button in the swipe screen now works as expected and redirects to the login view.
- The codebase is now cleaner and easier to maintain, with all Google authentication logic centralized.
