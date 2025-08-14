# 2025-08-14 - Implement ChatService with Optimistic Store Sync

## Objective

Implement a `ChatService` in `src/infraestructure/services/` that wraps the chat repository (React Query hooks) and keeps the presentation-layer stores (`chat-list.store.ts`, `current-chat.store.ts`) in sync. The service must provide CRUD methods for chats and messages, always using optimistic updates: update the store(s) first, then call the repository, and roll back if the operation fails.

## Action Plan

1. **Analyze APIs**
   - Review `ChatRepositoryImpl.ts` for available hooks.
   - Review `chat-list.store.ts` and `current-chat.store.ts` for store APIs.

2. **Design Service**
   - Create `ChatService.ts` in `src/infraestructure/services/`.
   - Expose methods for:
     - Creating, updating, deleting chats.
     - Sending, updating, deleting messages.
     - Adding/removing participants, archiving/muting chats, etc.
   - Each method:
     - Updates the relevant store(s) optimistically.
     - Calls the corresponding repository mutation.
     - Rolls back the store if the mutation fails.

3. **Store Synchronization**
   - When a chat or message changes, update both stores as needed (e.g., new message updates both the current chat and the chat list preview).

4. **Testing**
   - Add unit tests for the service (future task).

5. **Documentation**
   - Update this file with implementation notes.
   - Update `devlog.md` and `readme.md` as needed.

## Affected Files

- `src/infraestructure/services/ChatService.ts` (new)
- `src/infraestructure/repositories/ChatRepositoryImpl.ts` (read-only)
- `src/presentation/stores/chat-list.store.ts` (read-only)
- `src/presentation/stores/current-chat.store.ts` (read-only)
- `docs/devlog.md` (update after implementation)
- `readme.md` (update if necessary)

## Observations

- The repository uses React Query hooks, so the service will need to use these hooks internally or expose its own hooks.
- Optimistic updates require careful rollback logic.
- The service should be the only layer updating the stores for chat operations to avoid race conditions.

## Status

- [ ] Plan
- [ ] Doing
- [ ] Completed
- [ ] Suspended
- [ ] Canceled
