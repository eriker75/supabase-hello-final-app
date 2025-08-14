# Devlog

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
