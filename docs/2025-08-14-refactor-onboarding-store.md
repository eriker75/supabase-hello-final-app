# 2025-08-14 - Refactor Onboarding Store y Helper de Validación

## Resumen

Se refactorizó el store de onboarding para seguir la arquitectura y mejores prácticas de los stores de perfil de usuario, eliminando la lógica de validación y envío de datos del propio store. Se creó un helper reutilizable para la validación de pasos de onboarding basado en los schemas de presentación.

## Plan de acción

- Reemplazar el store de onboarding para:
  - Usar interfaces para el estado y acciones.
  - Mantener el state creator con persist, immer, partialize y zustandAsyncStorage.
  - Eliminar los métodos `submitOnboarding` y `validateCurrentStep` del store.
- Crear un helper en `src/utils/validateOnboardingStep.ts` para validar los pasos usando los schemas de presentación.
- Documentar los cambios en el devlog y este archivo.

## Archivos modificados/creados

- `src/presentation/stores/onboarding.store.ts` (refactor completo)
- `src/utils/validateOnboardingStep.ts` (nuevo helper)
- `docs/devlog.md` (actualización)
- `docs/2025-08-14-refactor-onboarding-store.md` (este archivo)

## Observaciones

- El store ahora es más limpio y desacoplado, siguiendo el patrón de los stores de perfil.
- La validación de pasos es reutilizable y puede evolucionar de forma independiente.
- Se recomienda manejar el submit de onboarding en la capa de servicios, fuera del store.
