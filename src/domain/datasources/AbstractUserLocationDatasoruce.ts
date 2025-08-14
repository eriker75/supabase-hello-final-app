import { UserLocationEntity } from "../entities/UserLocation.entity";

/**
 * AbstractUserLocationDatasource ahora es una clase abstracta.
 */
export abstract class AbstractUserLocationDatasource {
  abstract findByUserId(userId: string): Promise<UserLocationEntity | null>;
  abstract updateLocation(userId: string, latitude: number, longitude: number): Promise<UserLocationEntity>;
  abstract listNearbyUsers(userId: string, maxDistance: number): Promise<UserLocationEntity[]>;
  abstract delete(userId: string): Promise<void>;
}
