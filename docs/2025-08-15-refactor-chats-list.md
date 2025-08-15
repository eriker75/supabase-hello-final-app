# Refactor: Chats List View to Use Service Logic

**Date:** 2025-08-15

## Objective

Refactor the `app/dashboard/chats/index.tsx` view to preserve only the UI/design, moving all logic for fetching the initial chat list to a service. The chat list should be loaded from the user service (via `ChatService`) on page load. Real-time updates are not included in this phase.

## Action Plan

- Review project documentation and recent architectural changes.
- Analyze the current implementation of the chat list view.
- Identify or create a plain async service method to fetch the user's chats.
- Refactor the view to remove all store/hook logic and use the service for fetching chats.
- Document the process and update the devlog.

## Files Modified

- `src/infraestructure/services/ChatService.ts`: Added `getChatsForUser(userId: string): Promise<ChatEntity[]>`.
- `app/dashboard/chats/index.tsx`: Refactored to use the service for fetching chats, removed all store/hook logic, and preserved only the UI.

## Observations

- The chat list is now fetched imperatively from the service and stored in local state.
- All previous logic using React Query hooks, Zustand stores, and typing indicators was removed for clarity and maintainability.
- The UI and design remain unchanged.
- Some unrelated TypeScript/ESLint errors are present (missing SVG/type declarations, router type), but do not affect the core refactor.

## Next Steps

- Update `docs/devlog.md` with a summary of this change.
- Address any remaining type/module resolution issues as a separate task if needed.
