import { UserLocationEntity } from "@/src/domain/entities/UserLocation.entity";
import { UserLocationController } from "@/src/infraestructure/api/UserLocationController";
import { toDomainUserLocation } from "@/src/infraestructure/mappers/UserLocationMapper";

/**
 * UserLocationDatasourceImpl: Implements user location data operations
 * as class methods, delegating to UserLocationController and using mappers.
 */
export class UserLocationDatasourceImpl {
  private controller: UserLocationController;

  constructor() {
    this.controller = new UserLocationController();
  }

  async findByUserId(userId: string): Promise<UserLocationEntity | null> {
    const row = await this.controller.findByUserId(userId);
    if (!row) return null;
    return toDomainUserLocation(row, row.updated_at);
  }

  async updateLocation(userId: string, latitude: number, longitude: number): Promise<UserLocationEntity> {
    const row = await this.controller.updateLocation(userId, latitude, longitude);
    return toDomainUserLocation(row, row.updated_at);
  }

  async listNearbyUsers(userId: string, maxDistance: number): Promise<UserLocationEntity[]> {
    const res = await this.controller.listNearbyProfiles({ user_id: userId, maxDistance });
    if (!res.profiles) return [];
    return res.profiles.map((row: any) => toDomainUserLocation(row, row.updated_at));
  }

  async delete(userId: string): Promise<void> {
    await this.controller.delete(userId);
  }
}
