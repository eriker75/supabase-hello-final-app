export interface UserLocationProps {
  userId: string;
  latitude: number;
  longitude: number;
  updatedAt: Date;
}

/**
 * UserLocationEntity ahora es una interface simple, sin lógica interna.
 */
export interface UserLocationEntity {
  userId: string;
  latitude: number;
  longitude: number;
  updatedAt: Date;
}
