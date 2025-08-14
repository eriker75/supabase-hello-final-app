import { UserProfileEntity } from "../entities/UserProfile.entity";

/**
 * UserProfile Datasource contract for domain/application use.
 */
export interface IUserProfileDatasource {
  // CRUD
  findById(id: string): Promise<UserProfileEntity | null>;
  findAll(): Promise<UserProfileEntity[]>;
  save(entity: UserProfileEntity): Promise<void>;
  update(entity: UserProfileEntity): Promise<void>;
  delete(id: string): Promise<void>;
  // Finders
  findByUserId(userId: string): Promise<UserProfileEntity | null>;
  findByEmail(email: string): Promise<UserProfileEntity | null>;
  findByAlias(alias: string): Promise<UserProfileEntity | null>;
  // Preferences
  getPreferences(userId: string): Promise<any>;
  setPreferences(userId: string, preferences: any): Promise<void>;
  // Location
  updateLocation(userId: string, latitude: number, longitude: number): Promise<void>;
  // Geo queries
  listNearbyProfiles(userId: string, maxDistance: number): Promise<UserProfileEntity[]>;
  listNearbySwipeableProfiles(userId: string, maxDistance: number, limit: number): Promise<UserProfileEntity[]>;
  // Onboarding
  onboardUser(userId: string, data: Partial<UserProfileEntity>): Promise<UserProfileEntity>;
  // Block/report
  blockUser(blockerId: string, blockedId: string): Promise<void>;
  reportUser(reporterId: string, reportedId: string, reason: string, details?: string): Promise<void>;
  // Online status
  setOnline(userId: string): Promise<void>;
  setOffline(userId: string): Promise<void>;
}
