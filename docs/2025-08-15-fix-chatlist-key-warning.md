# 2025-08-15 - Fix: React "key" warning in Chat List

## Context

A React warning was shown:  
`Each child in a list should have a unique "key" prop. See https://react.dev/link/warning-keys for more information.`  
This occurred in the chat list rendered by `VirtualizedList`/`FlatList` in `app/dashboard/chats/index.tsx`.

## Analysis

- The chat list uses a `FlatList` with `keyExtractor={(chat) => chat.chatId}`.
- If any chat object is missing a unique `chatId`, React will warn.
- The warning can also occur if `chatId` is duplicated or undefined/null.

## Solution

- Updated the `keyExtractor` in `app/dashboard/chats/index.tsx` to:
  - Use `chat.chatId` if present.
  - Fallback to a stringified index if `chatId` is missing, and log a warning in development mode.
- This ensures every list item has a unique key, preventing the React warning and aiding debugging if data is malformed.

## Files Modified

- `app/dashboard/chats/index.tsx`

## Observations

- TypeScript errors about missing SVG modules were detected but are unrelated to this fix.
- No changes were made to the data fetching or chat item rendering logic.

## Status

- [x] Implemented
- [ ] Verified in UI
- [ ] Devlog updated
