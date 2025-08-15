# 2025-08-15 - Implementación de lógica de swipe limitado y cola circular en nearby-swipeable-profiles.store

## Objetivo

Implementar en el store `nearby-swipeable-profiles.store.ts` la lógica para:

- Limitar el número de swipes (likes/passes) diarios por usuario (ej: 50), configurable por constante global.
- Llevar el conteo de swipes en las últimas 24 horas (`todaySwipedCounter`).
- Registrar la hora del primer swipe del lote de 24h.
- Prevenir swipes adicionales si se supera el límite diario, a menos que hayan pasado 24h desde el primer swipe (en cuyo caso se resetea el contador).
- Gestionar la cola de perfiles swipeables (`nearbySwipeableProfiles`) como una cola circular, cargando perfiles en lotes (por defecto 5, configurable por constante global).
- Al hacer swipe (like/pass), remover el perfil del arreglo y añadir uno nuevo, manteniendo el tamaño del lote.
- Si no hay más perfiles disponibles, marcar `hasMore` en false (aunque esto podría manejarse desde la capa de datos).

## Archivos a modificar

- `src/presentation/stores/nearby-swipeable-profiles.store.ts` (implementación principal)
- Este archivo de documentación
- `docs/devlog.md` (resumen al finalizar)

## Plan de acción

1. Definir constantes globales para el máximo de swipes diarios y el tamaño del lote de perfiles.
2. Añadir/ajustar propiedades en el store:
   - `todaySwipedCounter`
   - `firstSwipeTimestamp`
   - `nearbySwipeableProfiles` (cola circular)
   - `hasMore`
3. Implementar funciones:
   - `canSwipe`: retorna si el usuario puede hacer swipe según el límite y la ventana de 24h.
   - `registerSwipe`: incrementa el contador, actualiza el timestamp si es el primer swipe, resetea si corresponde.
   - `resetSwipeCounterIfNeeded`: verifica si han pasado 24h desde el primer swipe y resetea el contador si es necesario.
   - `loadInitialProfiles`: carga el lote inicial de perfiles.
   - `swipeProfile`: remueve el perfil swiped, añade uno nuevo, actualiza la cola y el estado.
4. Documentar decisiones y observaciones relevantes.
5. Actualizar `devlog.md` y este archivo al finalizar.

## Observaciones

- Seguir patrones de otros stores (zustand, immer, persistencia si aplica).
- Mantener el código modular y fácil de testear.
- No duplicar lógica ya existente en otros stores o servicios.
- Considerar integración con React Query para la obtención de perfiles.

## Implementación realizada (2025-08-15)

- Se crearon los archivos de constantes globales [`SWIPE_LIMITS.ts`](../src/definitions/constants/SWIPE_LIMITS.ts) para definir el máximo de swipes diarios y el tamaño del lote de perfiles swipeables.
- Se refactorizó el store [`nearby-swipeable-profiles.store.ts`](../src/presentation/stores/nearby-swipeable-profiles.store.ts):
  - Se eliminó `maxNumberOfProfiles` del estado y se usa la constante global.
  - Se agregó la propiedad `firstSwipeTimestamp` para llevar el control de la ventana de 24h.
  - Se implementaron las funciones `canSwipe`, `registerSwipe`, `resetSwipeCounterIfNeeded`, `loadInitialProfiles` y `swipeProfile` siguiendo la lógica solicitada.
  - Se eliminó la lógica antigua de incremento/decremento simple.
  - Se asegura la persistencia del estado relevante.
- El store ahora permite:
  - Limitar swipes diarios por usuario.
  - Resetear el contador si pasan más de 24h desde el primer swipe.
  - Gestionar la cola circular de perfiles, cargando y reemplazando perfiles según el batch size.
- Se siguieron los patrones de zustand, immer y persistencia ya presentes en el proyecto.
