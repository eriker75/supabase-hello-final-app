# Task: Crear OnboardingService siguiendo el patrón de ChatService

**Fecha:** 2025-08-15

## Objetivo

Implementar un servicio para manejar el onboarding del usuario, siguiendo la estructura y patrones de ChatService, utilizando OnboardingRepositoryImpl y el onboarding store.

## Plan de acción

- Analizar la estructura de ChatService y sus hooks.
- Revisar la implementación de OnboardingRepositoryImpl y onboarding.store.ts.
- Crear un nuevo archivo `OnboardingService.ts` en `src/infraestructure/services/` siguiendo el patrón de ChatService.
- Exponer hooks para las acciones del store y para el proceso de onboarding del usuario.
- Documentar el servicio y actualizar la documentación del proyecto.

## Archivos modificados/creados

- `src/infraestructure/services/OnboardingService.ts` (nuevo)
- `docs/2025-08-15-onboarding-service.md` (este archivo)

## Observaciones

- El servicio expone hooks para manipular el estado de onboarding y un hook principal para realizar el onboarding del usuario usando la mutación de react-query.
- Se resolvieron errores de tipado en la función de mutación.
- El servicio sigue el principio de modularidad y consistencia con el resto de la arquitectura.

## Siguientes pasos

- Actualizar `devlog.md` con el resumen de este cambio.
- Verificar integración y uso en la UI.
