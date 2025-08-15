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

## 2025-08-15 - Implementación de useLogout hook

- Se implementó el hook `useLogout` en `src/presentation/hooks/useLogout.ts` para cerrar sesión usando Supabase y limpiar el store de usuario autenticado.
- El hook maneja estados de loading y error, y expone una función `logout` lista para usar en componentes.
- Documentado el proceso y plan en [`2025-08-15-add-useLogout-hook.md`](./2025-08-15-add-useLogout-hook.md).

## 2025-08-15 - Refactor de vista de perfil para usar datos dinámicos y store

- Se refactorizó `app/dashboard/profile/[id]/index.tsx` para que utilice los datos del store `currentUserProfileStore` para el renderizado inicial rápido y, al montar la vista, obtenga los datos actualizados del perfil visitado usando el servicio y actualice el store.
- Esto permite una experiencia de carga fluida y asegura que la información mostrada esté sincronizada con el backend.
- Documentado el proceso y plan en [`2025-08-15-profile-view-dynamic-current-user.md`](./2025-08-15-profile-view-dynamic-current-user.md).

## 2025-08-15 - Refactor de vista de chats para usar lógica de servicio

- Se refactorizó `app/dashboard/chats/index.tsx` para eliminar toda la lógica de obtención de chats basada en hooks y stores, conservando únicamente el diseño/UI.
- Ahora la lista de chats iniciales se obtiene usando la función asíncrona `getChatsForUser(userId)` expuesta en `src/infraestructure/services/ChatService.ts`.
- Se eliminó la lógica de tiempo real y de indicadores de escritura para simplificar la vista.
- El listado se almacena en estado local y se maneja el loading/error de forma interna.
- Documentado el proceso y plan en [`2025-08-15-refactor-chats-list.md`](./2025-08-15-refactor-chats-list.md).

## 2025-08-15 - Refactor de vista onboarding/index.tsx para uso correcto de stores y validación

- Se refactorizó `app/onboarding/index.tsx` para importar y usar correctamente los stores de onboarding y autenticación desde `src/presentation/stores/`.
- Se eliminó el uso del método obsoleto `validateCurrentStep` del store de onboarding.
- Ahora la validación del paso usa el helper `validateOnboardingStep` de `src/utils/validateOnboardingStep.ts`.
- Se ajustó la lógica de redirección para usar la propiedad booleana `isOnboarded` del store de autenticación.
- Documentado el proceso y plan en [`2025-08-15-refactor-onboarding-index-store-usage.md`](./2025-08-15-refactor-onboarding-index-store-usage.md).

## 2025-08-15 - Eliminación de dotenv del runtime de Expo/React Native

- Se eliminó la importación y uso de `dotenv` en `app/_layout.tsx` porque Expo/React Native no soporta módulos core de Node.js como `path`, requerido por `dotenv`.
- No se detectó uso de variables de entorno en tiempo de ejecución en ese archivo, por lo que no fue necesario migrar lógica adicional.
- Documentado el proceso y plan en [`2025-08-15-remove-dotenv-from-runtime.md`](./2025-08-15-remove-dotenv-from-runtime.md).

## 2025-08-15 - Integración de slider de rango de edad en onboarding y fix de GestureHandler

- Se integró el componente `CustomInputRangeSlider` en la pantalla de onboarding para seleccionar el rango de edad preferido, conectado al store de onboarding (`minAgePreference` y `maxAgePreference`).
- Se resolvió el error de gestos (`PanGestureHandler must be used as a descendant of GestureHandlerRootView`) envolviendo el root layout en `GestureHandlerRootView` en `app/_layout.tsx`.
- Documentado el proceso y plan en [`2025-08-15-onboarding-age-range-slider.md`](./2025-08-15-onboarding-age-range-slider.md).
