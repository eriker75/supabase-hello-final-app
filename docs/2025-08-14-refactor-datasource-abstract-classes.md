# Refactor: Ensure All Datasources Use Abstract Classes

**Date:** 2025-08-14

## Context

The project had inconsistent use of abstract classes for domain datasources. Some implementations did not extend their abstract/interface counterparts, and some abstract classes were missing or had naming inconsistencies.

## Action Plan

- Create missing abstract classes for Interaction and Onboarding datasources.
- Ensure all datasource implementations extend/implement their corresponding abstract class/interface.
- Refactor `UserProfileDatasourceImpl` to fully implement `AbstractUserProfileDatasource`, including correct method signatures and type mappings.
- Clean up duplicate and nested method definitions caused by previous errors.
- Confirm that `UserLocationDatasourceImpl` fully implements its abstract class.

## Files Modified

- `src/domain/datasources/AbstractInteractionDatasource.ts` (created)
- `src/domain/datasources/AbstractOnboardingDatasource.ts` (created)
- `src/infraestructure/datasources/InteractionDatasourceImp.ts`
- `src/infraestructure/datasources/OnboardingDatasourceImpl.ts`
- `src/infraestructure/datasources/UserLocationDatasourceImpl.ts`
- `src/infraestructure/datasources/UserProfileDatasourceImpl.ts`

## Observations

- The naming of some abstract classes and interfaces (e.g., "Datasoruce" typo) remains for now to avoid a large breaking refactor.
- `UserProfileDatasourceImpl` required significant cleanup due to previous corruption and method duplication.
- All datasources now consistently implement their domain abstract/interface contracts.

## Status

- [x] All datasources now extend/implement their abstract/interface contracts.
- [x] All required abstract methods are implemented with correct signatures.
- [x] Codebase is consistent and ready for further development.
