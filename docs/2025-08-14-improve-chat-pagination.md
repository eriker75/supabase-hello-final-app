# Task: Improve Chat Pagination Logic in CurrentChatState

**Date:** 2025-08-14

## Objective

Enhance the `CurrentChatState` store to robustly handle paginated loading of chat messages, ensuring:

- Correct merging of paginated message batches.
- Messages are always ordered by `createdAt` descending (newest first).
- Pagination state is tracked (`page`, `perPage`, `total`, `hasMore`).
- No duplicate messages.

## Action Plan

1. Analyze the current implementation in `src/presentation/stores/current-chat.store.ts`.
2. Add pagination state to `CurrentChatState`:
   - `page`, `perPage`, `total`, `hasMore`
3. Add/modify actions:
   - `appendMessages(messages: CurrentChatMessageState[])`
   - `setPagination({ page, perPage, total, hasMore })`
   - Ensure all message updates maintain correct order and deduplication.
4. Implement a utility to merge and deduplicate messages by `messageId`.
5. Update message loading logic to support "load more" (prepend older messages).
6. Document changes here and update the devlog after completion.

## Files to Modify

- `src/presentation/stores/current-chat.store.ts`
- (This documentation file)

## Observations

- The API returns messages in ascending order (oldest first), but the UI should display them descending (newest first).
- The store must handle merging new pages of messages without duplicating or reordering incorrectly.
- No prior documentation or devlog exists for this task.

## Implementation Summary

- Extended `CurrentChatState` with pagination fields: `page`, `perPage`, `total`, `hasMore`.
- Added actions: `appendMessages`, `setPagination`.
- All message updates now use a utility to merge, deduplicate by `messageId`, and sort by `createdAt` descending.
- The store now supports paginated loading and correct ordering for chat messages.
- As `docs/devlog.md` does not exist, this summary is included here.

## Status

- Plan: Completed
- Implementation: Completed
- Review: Completed
