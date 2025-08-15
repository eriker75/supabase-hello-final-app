# Task: Remove dotenv Usage from Runtime

**Date:** 2025-08-15

## Context

The project currently imports and uses the `dotenv` package in `app/_layout.tsx`. This causes a runtime error in Expo/React Native because these environments do not support Node.js core modules (such as `path`, which is used by `dotenv`). Environment variables in Expo should be managed using Expo's configuration system (e.g., `app.config.js`, `app.json`, or build-time injection).

## Action Plan

1. Remove the import and usage of `dotenv` from `app/_layout.tsx`.
2. Review the code for any environment variable usage and migrate it to Expo's supported system if necessary.
3. Update documentation and the development log to reflect these changes.

## Files to Modify

- `app/_layout.tsx`

## Observations

- Using `dotenv` in the React Native/Expo runtime is not supported and will always fail.
- If environment variables are required at runtime, they must be provided via Expo's configuration or build-time injection, not via `dotenv`.

## Status

- [In Progress] Documenting and planning the removal of `dotenv` from the runtime.
