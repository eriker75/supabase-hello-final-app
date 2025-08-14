import { UserProfileEntity } from "../entities/UserProfile.entity";

/**
 * UserProfile Datasource contract for domain/application use.
 */
/**
 * IUserProfileDatasource ahora es una clase abstracta.
 */
export abstract class IUserProfileDatasource {
  // CRUD
  abstract findById(id: string): Promise<UserProfileEntity | null>;
  abstract findAll(): Promise<UserProfileEntity[]>;
  abstract save(entity: UserProfileEntity): Promise<void>;
  abstract update(entity: UserProfileEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
  // Finders
  abstract findByUserId(userId: string): Promise<UserProfileEntity | null>;
  abstract findByEmail(email: string): Promise<UserProfileEntity | null>;
  abstract findByAlias(alias: string): Promise<UserProfileEntity | null>;
  // Preferences
  abstract getPreferences(userId: string): Promise<any>;
  abstract setPreferences(userId: string, preferences: any): Promise<void>;
  // Location
  abstract updateLocation(userId: string, latitude: number, longitude: number): Promise<void>;
  // Geo queries
  abstract listNearbyProfiles(userId: string, maxDistance: number): Promise<UserProfileEntity[]>;
  abstract listNearbySwipeableProfiles(userId: string, maxDistance: number, limit: number): Promise<UserProfileEntity[]>;
  // Onboarding
  abstract onboardUser(userId: string, data: Partial<UserProfileEntity>): Promise<UserProfileEntity>;
  // Block/report
  abstract blockUser(blockerId: string, blockedId: string): Promise<void>;
  abstract reportUser(reporterId: string, reportedId: string, reason: string, details?: string): Promise<void>;
  // Online status
  abstract setOnline(userId: string): Promise<void>;
  abstract setOffline(userId: string): Promise<void>;
}
