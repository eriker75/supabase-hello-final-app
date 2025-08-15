# Devlog

## 2025-08-14 - Refactor Onboarding Store y helper de validación

- Se refactorizó el store de onboarding para seguir la arquitectura y mejores prácticas de los stores de perfil de usuario.
- Se eliminaron los métodos `submitOnboarding` y `validateCurrentStep` del store, moviendo la validación a un helper en `src/utils/validateOnboardingStep.ts`.
- El store ahora utiliza interfaces, state creator, persist, immer, partialize y zustandAsyncStorage, siguiendo el patrón de los stores de perfil.
- Documentado el proceso y plan en [`2025-08-14-refactor-onboarding-store.md`](./2025-08-14-refactor-onboarding-store.md).

## 2025-08-14 - Migración de entidades a interfaces y datasources a clases abstractas

Se realizó una migración estructural importante en la capa de dominio e infraestructura:

- Todas las entidades de dominio basadas en clases fueron migradas a interfaces.
- Todas las interfaces de datasources de dominio fueron migradas a clases abstractas.
- Se adaptaron todos los mappers y datasources de infraestructura para trabajar con las nuevas interfaces y clases abstractas.
- Se eliminaron los usos de `new` para instanciar entidades, utilizando objetos literales y factorías puras.
- Se migró la entidad `ChatRealtimeEventEntity` a un tipo discriminado y factorías puras.
- Se verificaron y ajustaron los imports y tipos en toda la capa de dominio e infraestructura.
- Falta ejecutar pruebas completas para validar el funcionamiento final y corregir posibles errores derivados de la migración.

Ver detalles y checklist en [`2025-08-14-migracion-entidades-a-interfaces.md`](./2025-08-14-migracion-entidades-a-interfaces.md).

## 2025-08-14 - Implementación de repositories para onboarding e interactions

- Se crearon los repositories `OnboardingRepositoryImpl.ts` e `InteractionRepositoryImpl.ts` siguiendo el patrón de hooks y datasources de la infraestructura.
- Los nuevos repositories exponen hooks React Query para las operaciones principales de onboarding e interacción (matches, swipes).
- Se documentó el proceso en [`2025-08-14-add-onboarding-interaction-repositories.md`](./2025-08-14-add-onboarding-interaction-repositories.md).
- Falta agregar tests unitarios para los nuevos hooks.

## 2025-08-14 - Implementación de ChatService con sincronización optimista de stores

- Se implementó `ChatService` en `src/infraestructure/services/ChatService.ts`.
- El servicio expone métodos CRUD y de mensajes para chat, utilizando actualizaciones optimistas sobre los stores de presentación (`chat-list.store.ts` y `current-chat.store.ts`).
- Se eliminó el uso incorrecto de hooks de React Query en el servicio; ahora utiliza directamente el datasource de infraestructura.
- Se corrigieron los tipos y propiedades para ajustarse a las entidades de dominio.
- El servicio mantiene la sincronización y rollback de los stores ante errores en las operaciones.
- Documentado el plan y detalles en [`2025-08-14-chat-service-optimistic-sync.md`](./2025-08-14-chat-service-optimistic-sync.md).

## 2025-08-14 - Datasource Abstract Class Refactor

- Ensured all datasource implementations extend or implement their corresponding abstract class/interface in the domain layer.
- Created missing abstract classes for Interaction and Onboarding datasources.
- Refactored `UserProfileDatasourceImpl` to fully implement `AbstractUserProfileDatasource`, fixing method signatures and type mappings, and cleaning up previous corruption.
- Confirmed `UserLocationDatasourceImpl` fully implements its abstract class.
- Improved consistency and maintainability of the codebase for future development.

See [`2025-08-14-refactor-datasource-abstract-classes.md`](2025-08-14-refactor-datasource-abstract-classes.md) for full details.

## 2025-08-15 - Implementación de OnboardingService siguiendo el patrón de ChatService

- Se creó `OnboardingService` en `src/infraestructure/services/OnboardingService.ts`, siguiendo la arquitectura y patrones de `ChatService`.
- El servicio expone hooks para manipular el estado de onboarding y un hook principal para realizar el onboarding del usuario usando la mutación de React Query.
- Integra el store de onboarding y el repository `OnboardingRepositoryImpl` para mantener la consistencia y modularidad.
- Se documentó el proceso y plan en [`2025-08-15-onboarding-service.md`](./2025-08-15-onboarding-service.md).
