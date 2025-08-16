import { UserProfileEntity } from "@/src/domain/entities/UserProfile.entity";
import { UserProfileDatasourceImpl } from "@/src/infraestructure/datasources/UserProfileDatasourceImpl";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

const datasource = new UserProfileDatasourceImpl();

// --- CRUD ---

/** Find a profile by its unique id */
export function useFindUserProfileById(
  id: string
): UseQueryResult<UserProfileEntity | null> {
  return useQuery({
    queryKey: ["userProfile", "findById", id],
    queryFn: () => datasource.getProfile({ id }),
    enabled: !!id,
  });
}

/** List all profiles (default pagination) */
export function useListUserProfiles(): UseQueryResult<UserProfileEntity[]> {
  return useQuery({
    queryKey: ["userProfile", "listAll"],
    queryFn: () => datasource.listProfiles({ limit: 100, offset: 0 }),
  });
}

/** Save a new user profile entity */
export function useCreateUserProfile(): UseMutationResult<
  UserProfileEntity,
  unknown,
  UserProfileEntity
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entity: UserProfileEntity) =>
      datasource.createProfile({
        user_id: entity.userId,
        alias: entity.alias,
        gender: entity.gender,
        avatar: entity.avatar,
        biography: entity.biography,
        birth_date: entity.birthDate
          ? entity.birthDate.toISOString()
          : undefined,
        is_onboarded: entity.isOnboarded,
        is_verified: entity.isVerified,
        is_active: entity.isActive,
        latitude: entity.latitude,
        longitude: entity.longitude,
        address: entity.address,
        secondary_images: entity.secondaryImages,
        min_age: entity.preferences?.minAge,
        max_age: entity.preferences?.maxAge,
        max_distance: entity.preferences?.maxDistance,
        genders: entity.preferences?.genders
          ? entity.preferences.genders.map((g) =>
              typeof g === "string" ? parseInt(g, 10) : g
            )
          : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

/** Update an existing user profile entity */
export function useUpdateUserProfile(): UseMutationResult<
  void,
  unknown,
  UserProfileEntity
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entity: UserProfileEntity) =>
      datasource.updateProfile({
        id: entity.id,
        user_id: entity.userId,
        alias: entity.alias,
        gender: entity.gender,
        avatar: entity.avatar,
        biography: entity.biography,
        birth_date: entity.birthDate
          ? entity.birthDate.toISOString()
          : undefined,
        is_onboarded: entity.isOnboarded,
        is_verified: entity.isVerified,
        is_active: entity.isActive,
        latitude: entity.latitude,
        longitude: entity.longitude,
        address: entity.address,
        secondary_images: entity.secondaryImages,
        min_age: entity.preferences?.minAge,
        max_age: entity.preferences?.maxAge,
        max_distance: entity.preferences?.maxDistance,
        genders: entity.preferences?.genders
          ? entity.preferences.genders.map((g) =>
              typeof g === "string" ? parseInt(g, 10) : g
            )
          : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

/** Delete a user profile by id */
export function useDeleteUserProfile(): UseMutationResult<
  void,
  unknown,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => datasource.deleteProfile({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// --- Finders ---

/** Find a profile by userId */
export function useFindUserProfileByUserId(
  userId: string
): UseQueryResult<UserProfileEntity | null> {
  return useQuery({
    queryKey: ["userProfile", "findByUserId", userId],
    queryFn: () => datasource.getUser({ id: userId }),
    enabled: !!userId,
  });
}

/** Find a profile by email */
export function useFindUserProfileByEmail(
  email: string
): UseQueryResult<UserProfileEntity | null> {
  return useQuery({
    queryKey: ["userProfile", "findByEmail", email],
    queryFn: () => datasource.findByEmail(email),
    enabled: !!email,
  });
}

/** Find a profile by alias */
export function useFindUserProfileByAlias(
  alias: string
): UseQueryResult<UserProfileEntity | null> {
  return useQuery({
    queryKey: ["userProfile", "findByAlias", alias],
    queryFn: () => datasource.findByAlias(alias),
    enabled: !!alias,
  });
}

// --- Preferences ---

/** Get preferences for a user */
export function useGetPreferences(userId: string): UseQueryResult<any | null> {
  return useQuery({
    queryKey: ["userProfile", "getPreferences", userId],
    queryFn: () => datasource.getPreferences(userId),
    enabled: !!userId,
  });
}

/** Set preferences for a user */
export function useSetPreferences(): UseMutationResult<
  void,
  unknown,
  { userId: string; preferences: any }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, preferences }) =>
      datasource.setPreferences(userId, preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// --- Location ---

/** Update user location (latitude, longitude) */
export function useUpdateUserLocation(): UseMutationResult<
  void,
  unknown,
  { userId: string; latitude: number; longitude: number }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, latitude, longitude }) =>
      datasource.updateLocation(userId, latitude, longitude),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// --- Geo queries ---

/** List nearby profiles (geo) */
export function useListNearbyProfiles(
  userId: string,
  maxDistance: number
): UseQueryResult<UserProfileEntity[]> {
  return useQuery({
    queryKey: ["userProfile", "listNearbyProfiles", userId, maxDistance],
    queryFn: () => datasource.listNearbyProfiles(userId, maxDistance),
    enabled: !!userId && !!maxDistance,
  });
}

/** List nearby swipeable profiles (geo) */
export function useListNearbySwipeableProfiles(
  userId: string,
  maxDistance: number,
  count: number
): UseQueryResult<UserProfileEntity[]> {
  return useQuery({
    queryKey: [
      "userProfile",
      "listNearbySwipeableProfiles",
      userId,
      maxDistance,
      count,
    ],
    queryFn: () =>
      datasource.listNearbySwipeableProfiles(userId, maxDistance, count),
    enabled: !!userId && !!maxDistance && !!count,
  });
}

/** List nearby matches (geo) */
export function useListNearbyMatches(
  userId: string,
  maxDistance: number
): UseQueryResult<UserProfileEntity[]> {
  return useQuery({
    queryKey: ["userProfile", "listNearbyMatches", userId, maxDistance],
    queryFn: () => datasource.listNearbyMatches(userId, maxDistance),
    enabled: !!userId && !!maxDistance,
  });
}

/** Update my location (geo) */
export function useUpdateMyLocation(): UseMutationResult<
  void,
  unknown,
  { userId: string; latitude: number; longitude: number }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, latitude, longitude }) =>
      datasource.updateMyLocation(userId, latitude, longitude),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// --- Onboarding ---

/** Onboard a user (not implemented) */
export function useOnboardUser(): UseMutationResult<
  UserProfileEntity,
  unknown,
  { userId: string; data: Partial<UserProfileEntity> }
> {
  return useMutation({
    mutationFn: ({ userId, data }) => datasource.onboardUser(userId, data),
  });
}

// --- Block/report ---

/** Block a user */
export function useBlockUser(): UseMutationResult<
  void,
  unknown,
  { blockerId: string; blockedId: string }
> {
  return useMutation({
    mutationFn: ({ blockerId, blockedId }) =>
      datasource.blockUser(blockerId, blockedId),
  });
}

/** Report a user */
export function useReportUser(): UseMutationResult<
  void,
  unknown,
  { reporterId: string; reportedId: string; reason: string; details?: string }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reporterId, reportedId, reason, details }) =>
      datasource.reportUser(reporterId, reportedId, reason, details),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// --- Online status ---

/** Set user online */
export function useSetOnline(): UseMutationResult<void, unknown, string> {
  return useMutation({
    mutationFn: (userId: string) => datasource.setOnline(userId),
  });
}

/** Set user offline */
export function useSetOffline(): UseMutationResult<void, unknown, string> {
  return useMutation({
    mutationFn: (userId: string) => datasource.setOffline(userId),
  });
}
