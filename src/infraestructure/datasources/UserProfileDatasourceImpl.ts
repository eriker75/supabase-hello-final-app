import { UserProfileEntity } from "@/src/domain/entities/UserProfile.entity";
import { UserProfileController } from "@/src/infraestructure/api/UserProfileController";
import {
  toDomainUserProfile,
  toDomainUserProfileList,
} from "@/src/infraestructure/mappers/UserProfileMapper";
import {
  CreateProfileRequest,
  DeleteProfileRequest,
  GetProfileRequest,
  ListProfilesRequest,
  ProfileResponse,
  UpdateProfileRequest,
} from "../../domain/models/profile";
import {
  CreateUserRequest,
  DeleteUserRequest,
  GetUserRequest,
  ListUsersRequest,
  MeUserRequest,
  UpdateUserRequest,
  UserResponse,
} from "../../domain/models/user";

/**
 * UserProfileDatasourceImpl: Implements user and profile data operations
 * as class methods, delegating to UserProfileController and using mappers.
 */
export class UserProfileDatasourceImpl {
  private controller: UserProfileController;

  constructor() {
    this.controller = new UserProfileController();
  }

  async createUser(req: CreateUserRequest): Promise<UserProfileEntity> {
    const res: UserResponse = await this.controller.createUser(req);
    const profile = {
      ...res.profile,
      id: res.profile.id ?? res.profile.user_id ?? "",
      last_online:
        "last_online" in res.profile ? (res.profile as any).last_online : null,
      is_online:
        "is_online" in res.profile ? (res.profile as any).is_online : null,
      location:
        "location" in res.profile ? (res.profile as any).location : null,
    };
    return toDomainUserProfile({
      id: profile.id,
      profile,
      preferences: res.preferences,
    });
  }

  async listUsers(req: ListUsersRequest): Promise<UserProfileEntity[]> {
    const res = await this.controller.listUsers(req);
    if (!res.users) return [];
    const responses = res.users.map((u: any) => {
      const profile = {
        ...u.profile,
        id: u.profile.id ?? u.profile.user_id ?? "",
        last_online:
          "last_online" in u.profile ? (u.profile as any).last_online : null,
        is_online:
          "is_online" in u.profile ? (u.profile as any).is_online : null,
        location: "location" in u.profile ? (u.profile as any).location : null,
      };
      return { id: profile.id, profile, preferences: u.preferences };
    });
    return toDomainUserProfileList(responses);
  }

  async getUser(req: GetUserRequest): Promise<UserProfileEntity | null> {
    const res: UserResponse = await this.controller.getUser(req);
    if (!res || !res.profile) return null;
    const profile = {
      ...res.profile,
      id: res.profile.id ?? res.profile.user_id ?? "",
      last_online:
        "last_online" in res.profile ? (res.profile as any).last_online : null,
      is_online:
        "is_online" in res.profile ? (res.profile as any).is_online : null,
      location:
        "location" in res.profile ? (res.profile as any).location : null,
    };
    return toDomainUserProfile({
      id: profile.id,
      profile,
      preferences: res.preferences,
    });
  }

  async getMeUser(req: MeUserRequest): Promise<UserProfileEntity | null> {
    const res: UserResponse = await this.controller.getMeUser(req);
    if (!res || !res.profile) return null;
    const profile = {
      id: res.profile.id ?? res.profile.user_id ?? "",
      user_id: res.profile.user_id ?? "",
      alias: res.profile.alias ?? null,
      biography: res.profile.biography ?? null,
      birth_date: res.profile.birth_date ?? null,
      gender: res.profile.gender ?? null,
      avatar: res.profile.avatar ?? null,
      address: res.profile.address ?? null,
      last_online:
        "last_online" in res.profile ? (res.profile as any).last_online : null,
      is_onboarded: res.profile.is_onboarded ?? null,
      is_verified: res.profile.is_verified ?? null,
      latitude: res.profile.latitude ?? null,
      longitude: res.profile.longitude ?? null,
      is_online:
        "is_online" in res.profile ? (res.profile as any).is_online : null,
      is_active: res.profile.is_active ?? null,
      location:
        "location" in res.profile ? (res.profile as any).location : null,
      secondary_images: res.profile.secondary_images ?? null,
    };
    return toDomainUserProfile({
      id: profile.id,
      profile,
      preferences: res.preferences,
    });
  }

  async updateUser(req: UpdateUserRequest): Promise<void> {
    await this.controller.updateUser(req);
  }

  async deleteUser(req: DeleteUserRequest): Promise<void> {
    await this.controller.deleteUser(req);
  }

  async createProfile(req: CreateProfileRequest): Promise<UserProfileEntity> {
    const res: ProfileResponse = await this.controller.createProfile(req);
    const profile = {
      ...res.profile,
      id: res.profile.id ?? res.profile.user_id ?? "",
      last_online:
        "last_online" in res.profile ? (res.profile as any).last_online : null,
      is_online:
        "is_online" in res.profile ? (res.profile as any).is_online : null,
      location:
        "location" in res.profile ? (res.profile as any).location : null,
    };
    return toDomainUserProfile({
      id: profile.id,
      profile,
      preferences: res.preferences,
    });
  }

  async listProfiles(req: ListProfilesRequest): Promise<UserProfileEntity[]> {
    const res = await this.controller.listProfiles(req);
    if (!res.profiles) return [];
    const responses = res.profiles.map((p: any) => {
      const profile = {
        ...p.profile,
        id: p.profile.id ?? p.profile.user_id ?? "",
        last_online:
          "last_online" in p.profile ? (p.profile as any).last_online : null,
        is_online:
          "is_online" in p.profile ? (p.profile as any).is_online : null,
        location: "location" in p.profile ? (p.profile as any).location : null,
      };
      return { id: profile.id, profile, preferences: p.preferences };
    });
    return toDomainUserProfileList(responses);
  }

  async getProfile(req: GetProfileRequest): Promise<UserProfileEntity | null> {
    const res: ProfileResponse = await this.controller.getProfile(req);
    if (!res || !res.profile) return null;
    const profile = {
      ...res.profile,
      id: res.profile.id ?? res.profile.user_id ?? "",
      last_online:
        "last_online" in res.profile ? (res.profile as any).last_online : null,
      is_online:
        "is_online" in res.profile ? (res.profile as any).is_online : null,
      location:
        "location" in res.profile ? (res.profile as any).location : null,
    };
    return toDomainUserProfile({
      id: profile.id,
      profile,
      preferences: res.preferences,
    });
  }

  async updateProfile(req: UpdateProfileRequest): Promise<void> {
    await this.controller.updateProfile(req);
  }

  async deleteProfile(req: DeleteProfileRequest): Promise<void> {
    await this.controller.deleteProfile(req);
  }

  // The following methods return raw data or void, so no mapping is needed
  listNearbyProfiles(req: {
    user_id: string;
    maxDistance?: number;
  }): Promise<any> {
    return this.controller.listNearbyProfiles(req);
  }

  listNearbySwipeableProfiles(req: {
    user_id: string;
    maxDistance?: number;
    count?: number;
  }): Promise<any> {
    return this.controller.listNearbySwipeableProfiles(req);
  }

  listNearbyMatches(req: {
    user_id: string;
    maxDistance?: number;
  }): Promise<any> {
    return this.controller.listNearbyMatches(req);
  }

  findByEmail(email: string): Promise<any | null> {
    return this.controller.findByEmail(email);
  }

  findByAlias(alias: string): Promise<any | null> {
    return this.controller.findByAlias(alias);
  }

  getPreferences(userId: string): Promise<any | null> {
    return this.controller.getPreferences(userId);
  }

  setPreferences(userId: string, preferences: any): Promise<void> {
    return this.controller.setPreferences(userId, preferences);
  }

  updateLocation(
    userId: string,
    latitude: number,
    longitude: number
  ): Promise<void> {
    return this.controller.updateLocation(userId, latitude, longitude);
  }

  blockUser(blockerId: string, blockedId: string): Promise<void> {
    return this.controller.blockUser(blockerId, blockedId);
  }

  reportUser(
    reporterId: string,
    reportedId: string,
    reason: string,
    details?: string
  ): Promise<void> {
    return this.controller.reportUser(reporterId, reportedId, reason, details);
  }

  setOnline(userId: string): Promise<void> {
    return this.controller.setOnline(userId);
  }

  setOffline(userId: string): Promise<void> {
    return this.controller.setOffline(userId);
  }
}
