# Task: Add Onboarding and Interaction Repositories

**Date:** 2025-08-14

## Context

Se requieren dos nuevos repositories siguiendo el patrón de los existentes: uno para onboarding y otro para interactions. Esto permitirá desacoplar la lógica de acceso a datos y exponer hooks consistentes para el dominio onboarding e interactions.

## Action Plan

1. Revisar la estructura de los repositories existentes.
2. Verificar la existencia de los datasources correspondientes.
3. Implementar `OnboardingRepositoryImpl.ts` y `InteractionRepositoryImpl.ts` en `src/infraestructure/repositories/`.
4. Exponer hooks React Query para las operaciones principales de cada datasource.
5. Documentar el cambio en `/docs` y actualizar `devlog.md`.

## Files Created

- `src/infraestructure/repositories/OnboardingRepositoryImpl.ts`
- `src/infraestructure/repositories/InteractionRepositoryImpl.ts`
- `docs/2025-08-14-add-onboarding-interaction-repositories.md` (este archivo)

## Observations

- Los hooks siguen el patrón de los repositories previos, usando instancias singleton de los datasources.
- Se corrigieron imports para evitar errores de tipado.
- Falta agregar tests unitarios para los nuevos hooks (pendiente).
- Se debe actualizar `devlog.md` y revisar si `readme.md` requiere mención de estos nuevos repositories.
