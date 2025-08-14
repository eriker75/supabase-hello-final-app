import { UserLocationEntity } from "../entities/UserLocation.entity";

/**
 * UserLocation Datasource contract for domain/application use.
 */
/**
 * IUserLocationDatasource ahora es una clase abstracta.
 */
export abstract class IUserLocationDatasource {
  abstract findByUserId(userId: string): Promise<UserLocationEntity | null>;
  abstract updateLocation(userId: string, latitude: number, longitude: number): Promise<UserLocationEntity>;
  abstract listNearbyUsers(userId: string, maxDistance: number): Promise<UserLocationEntity[]>;
  abstract delete(userId: string): Promise<void>;
}
