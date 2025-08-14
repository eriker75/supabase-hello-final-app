import { UserLocationEntity } from "@/src/domain/entities/UserLocation.entity";
import { UserLocationDatasourceImpl } from "@/src/infraestructure/datasources/UserLocationDatasourceImpl";
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";

const datasource = new UserLocationDatasourceImpl();

// Queries
export function useFindUserLocationByUserId(userId: string): UseQueryResult<UserLocationEntity | null> {
  return useQuery({
    queryKey: ["userLocation", "findByUserId", userId],
    queryFn: () => datasource.findByUserId(userId),
    enabled: !!userId,
  });
}

export function useListNearbyUserLocations(userId: string, maxDistance: number): UseQueryResult<UserLocationEntity[]> {
  return useQuery({
    queryKey: ["userLocation", "listNearby", userId, maxDistance],
    queryFn: () => datasource.listNearbyUsers(userId, maxDistance),
    enabled: !!userId && !!maxDistance,
  });
}

// Mutations
export function useUpdateUserLocation(): UseMutationResult<UserLocationEntity, unknown, { userId: string; latitude: number; longitude: number }> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, latitude, longitude }) =>
      datasource.updateLocation(userId, latitude, longitude),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLocation"] });
    },
  });
}

export function useDeleteUserLocation(): UseMutationResult<void, unknown, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => datasource.delete(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLocation"] });
    },
  });
}
