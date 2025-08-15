# 2025-08-15 - Implementación de useLogout hook

## Objetivo

Crear un hook `useLogout` en `src/presentation/hooks` que permita cerrar sesión en la aplicación utilizando Supabase y limpie el estado del usuario autenticado en el store.

## Plan de acción

- Revisar la arquitectura y los stores existentes para identificar el flujo de logout.
- Implementar el hook usando el cliente de Supabase (`supabase.auth.signOut()`) y el método `resetProfile` del store `auth-user-profile`.
- Manejar estados de loading y error en el hook.
- Documentar el proceso y actualizar el devlog.

## Archivos modificados/creados

- `src/presentation/hooks/useLogout.ts` (nuevo)
- `docs/2025-08-15-add-useLogout-hook.md` (este archivo)
- `docs/devlog.md` (resumen de cambios)

## Observaciones

- El hook sigue la arquitectura y patrones del proyecto.
- Se utiliza el store zustand para limpiar el estado del usuario tras el logout.
- El hook está listo para ser usado en componentes de presentación.
