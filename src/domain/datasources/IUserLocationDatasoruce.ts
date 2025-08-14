import { UserLocationEntity } from "../entities/UserLocation.entity";

/**
 * UserLocation Datasource contract for domain/application use.
 */
export interface IUserLocationDatasource {
  findByUserId(userId: string): Promise<UserLocationEntity | null>;
  updateLocation(userId: string, latitude: number, longitude: number): Promise<UserLocationEntity>;
  listNearbyUsers(userId: string, maxDistance: number): Promise<UserLocationEntity[]>;
  delete(userId: string): Promise<void>;
}
