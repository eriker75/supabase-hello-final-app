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
