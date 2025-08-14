import {
  UserLocationEntity,
  UserLocationProps,
} from "../../domain/entities/UserLocation.entity";

// Maps Profile or UserProfile infra model to domain UserLocationEntity
export function toDomainUserLocation(
  profile: any,
  updatedAt?: string
): UserLocationEntity {
  const props: UserLocationProps = {
    userId: (profile as any).user_id,
    latitude: profile.latitude ?? 0,
    longitude: profile.longitude ?? 0,
    updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
  };
  return { ...props };
}
