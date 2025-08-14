import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { zustandAsyncStorage } from "../../utils/persister";

export interface CurrentUserProfileState {
  userId: string;
  profileId: string;
  birthDate: string;
  age: number;
  gender: number;
  gederInterests: string[];
  minAgePreference: number;
  maxAgePreference: number;
  maxDistance: number;
  alias: string;
  biography: string;
  avatar: string;
  address: string;
  latitude: string;
  longitude: string;
  secondaryImages: string[];
  isOnline: boolean;
  isActive: boolean;
  isOnboarded: boolean;
  lastOnline: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface CurrentUserProfileAction {
  setProfile: (profile: Partial<CurrentUserProfileState>) => void;
  updateProfile: (profile: Partial<CurrentUserProfileState>) => void;
  setLoading: (isLoading: boolean) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  resetProfile: () => void;
}

export type CurrentUserProfileStore = CurrentUserProfileState &
  CurrentUserProfileAction;

const initialState: CurrentUserProfileState = {
  userId: "",
  profileId: "",
  birthDate: "",
  age: 18,
  gender: 0,
  gederInterests: [],
  minAgePreference: 18,
  maxAgePreference: 98,
  maxDistance: 200,
  alias: "",
  biography: "",
  avatar: "",
  address: "",
  latitude: "",
  longitude: "",
  secondaryImages: [],
  isOnline: false,
  isActive: false,
  isOnboarded: false,
  lastOnline: "",
  isAuthenticated: false,
  isLoading: false,
  accessToken: "",
  refreshToken: "",
};

const currentUserProfileStoreCreator: StateCreator<
  CurrentUserProfileStore,
  [["zustand/immer", never]],
  [["zustand/persist", unknown]]
> = (set) => ({
  ...initialState,
  setProfile: (profile) =>
    set((state) => {
      Object.assign(state, profile);
    }),
  updateProfile: (profile) =>
    set((state) => {
      Object.assign(state, profile);
    }),
  setLoading: (isLoading) =>
    set((state) => {
      state.isLoading = isLoading;
    }),
  setAuthenticated: (isAuthenticated) =>
    set((state) => {
      state.isAuthenticated = isAuthenticated;
    }),
  resetProfile: () =>
    set(() => ({
      ...initialState,
    })),
});

export const currentUserProfileStore = create<CurrentUserProfileStore>()(
  persist(immer(currentUserProfileStoreCreator), {
    name: "current-user-profile-store",
    storage: zustandAsyncStorage,
    partialize: (state) => {
      const { isLoading, ...persisted } = state;
      return persisted;
    },
  })
);
