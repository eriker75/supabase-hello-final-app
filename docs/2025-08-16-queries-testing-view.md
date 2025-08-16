# 2025-08-16 - Implementación de vista de testing de queries de la API

## Objetivo

Crear una vista scrolleable en `app/queries.tsx` que permita probar todos los métodos públicos de los controladores de la API (`ChatController`, `InteractionController`, `OnboardingController`, `UserProfileController`) ubicados en `src/infraestructure/api/`. La vista debe mostrar inputs y botones para cada método, permitiendo ingresar parámetros y ver la respuesta, siguiendo el estilo gráfico de la aplicación.

## Archivos a modificar/crear

- `app/queries.tsx` (implementación de la vista)
- `docs/2025-08-16-queries-testing-view.md` (este archivo)
- Actualización de `docs/devlog.md` al finalizar la tarea

## Plan de acción

1. Analizar los métodos públicos de los controladores en `src/infraestructure/api/`.
2. Para cada método, crear una sección con:
   - Inputs para los parámetros requeridos (usando componentes de `components/forms/`).
   - Botón para ejecutar la query.
   - Área para mostrar el resultado o error.
3. Usar componentes de UI existentes para mantener la coherencia visual.
4. Hacer la vista scrolleable para facilitar el testing de todos los métodos.
5. Actualizar la lógica de redirección tras login para acceder a esta vista si el usuario ya está onboarded (temporalmente para testing).
6. Documentar el resultado y decisiones en `docs/devlog.md`.

## Observaciones

- Esta vista es solo para testing manual y no debe estar accesible en producción.
- Se prioriza la reutilización de componentes y la claridad visual.
- Se debe evitar la duplicación de lógica y facilitar la extensión futura para nuevos métodos.
