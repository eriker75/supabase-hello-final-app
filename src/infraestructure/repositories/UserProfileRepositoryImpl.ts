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

// Queries
export function useFindUserProfileById(
  id: string
): UseQueryResult<UserProfileEntity | null> {
  return useQuery({
    queryKey: ["userProfile", "findById", id],
    queryFn: () => datasource.getProfile({ id }),
    enabled: !!id,
  });
}

export function useListUserProfiles(): UseQueryResult<UserProfileEntity[]> {
  return useQuery({
    queryKey: ["userProfile", "listAll"],
    queryFn: () => datasource.listProfiles({ limit: 100, offset: 0 }),
  });
}

export function useFindUserProfileByUserId(
  userId: string
): UseQueryResult<UserProfileEntity | null> {
  return useQuery({
    queryKey: ["userProfile", "findByUserId", userId],
    queryFn: () => datasource.getUser({ id: userId }),
    enabled: !!userId,
  });
}

export function useListNearbyProfiles(
  userId: string,
  maxDistance: number
): UseQueryResult<UserProfileEntity[]> {
  return useQuery({
    queryKey: ["userProfile", "listNearbyProfiles", userId, maxDistance],
    queryFn: () =>
      datasource.listNearbyProfiles({ user_id: userId, maxDistance }),
    enabled: !!userId && !!maxDistance,
  });
}

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
      datasource.listNearbySwipeableProfiles({
        user_id: userId,
        maxDistance,
        count,
      }),
    enabled: !!userId && !!maxDistance && !!count,
  });
}

export function useListNearbyMatches(
  userId: string,
  maxDistance: number
): UseQueryResult<UserProfileEntity[]> {
  return useQuery({
    queryKey: ["userProfile", "listNearbyMatches", userId, maxDistance],
    queryFn: () =>
      datasource.listNearbyMatches({ user_id: userId, maxDistance }),
    enabled: !!userId && !!maxDistance,
  });
}

// Mutations
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
