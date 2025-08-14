# Migración de entidades basadas en clases a interfaces y datasources a clases abstractas

**Fecha de inicio:** 2025-08-14  
**Estado:** En progreso  
**Responsable:** Roo

## Objetivo

Migrar todas las entidades de dominio basadas en clases a interfaces, y convertir las interfaces de los datasources de la capa de dominio a clases abstractas. Adaptar todos los mappers y datasources de infraestructura para acoplarse a estos cambios, asegurando la compatibilidad y el correcto funcionamiento de la aplicación.

## Plan de acción

1. Identificar todas las entidades clase en `src/domain/entities/`.
2. Identificar todos los mappers y datasources que dependen de estas entidades.
3. Identificar todas las interfaces de datasources en `src/domain/datasources/`.
4. Migrar cada entidad clase a interface en `src/domain/entities/`.
5. Migrar cada interface de datasource en `src/domain/datasources/` a clase abstracta.
6. Actualizar todos los mappers de infraestructura para que utilicen las nuevas interfaces en vez de clases.
7. Actualizar todos los datasources de infraestructura para que utilicen las nuevas interfaces y clases abstractas en vez de clases e interfaces antiguas.
8. Verificar y ajustar los imports y tipos en toda la capa de dominio e infraestructura para evitar errores de tipado.
9. Probar el funcionamiento de la aplicación y corregir cualquier error derivado de la migración.

## Avances realizados

- [x] Todas las entidades clase de dominio fueron migradas a interfaces.
- [x] Todas las interfaces de datasources de dominio fueron migradas a clases abstractas.
- [x] Todos los mappers de infraestructura fueron adaptados para trabajar con interfaces.
- [x] Todos los datasources de infraestructura fueron adaptados para trabajar con interfaces y clases abstractas.
- [x] Se verificaron y ajustaron los imports y tipos en toda la capa de dominio e infraestructura.
- [ ] Se encuentra en proceso la prueba y corrección de errores derivados de la migración.

## Observaciones

- Se eliminaron todos los usos de `new` para instanciar entidades, reemplazándolos por objetos literales.
- Se migró la entidad `ChatRealtimeEventEntity` a un tipo discriminado y factorías puras.
- Se detectaron y corrigieron problemas de tipado y de imports tras la migración.
- Falta ejecutar pruebas completas para validar el funcionamiento final.
