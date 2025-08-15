import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  MAX_SWIPEABLE_PROFILES_BATCH,
  MAX_SWIPES_PER_DAY,
} from "../../definitions/constants/SWIPE_LIMITS";
import { zustandAsyncStorage } from "../../utils/zustandAsyncStorage";

export interface NearbySwipeableProfile {
  userId: string;
  profileId: string;
  biography: string;
  birthDay: string;
  distanceInKm: string;
  age: number;
  gender: number;
  genderInterests: string[];
  minAgePreference: number;
  maxAgePreference: number;
  maxDistancePreference: number;
  alias: string;
  name: string;
  avatar: string;
  address: string;
  latitude: string;
  longitude: string;
  secondaryImages: string[];
  isOnline: boolean;
  isActive: boolean;
  isOnboarded: boolean;
  lastOnline: string;
}

export interface NearbySwipeableProfilesState {
  nearbySwipeableProfiles: NearbySwipeableProfile[];
  hasMore: boolean;
  todaySwipedCounter: number;
  firstSwipeTimestamp: number | null; // Unix timestamp (ms) of first swipe in current 24h window
}

export interface NearbySwipeableProfilesAction {
  canSwipe: () => boolean;
  registerSwipe: () => void;
  resetSwipeCounterIfNeeded: () => void;
  loadInitialProfiles: (profiles: NearbySwipeableProfile[]) => void;
  swipeProfile: (newProfile: NearbySwipeableProfile | null) => void;
}

export type NearbySwipeableProfilesStore = NearbySwipeableProfilesState &
  NearbySwipeableProfilesAction;

const initialState: NearbySwipeableProfilesState = {
  nearbySwipeableProfiles: [],
  hasMore: false,
  todaySwipedCounter: 0,
  firstSwipeTimestamp: null,
};

const nearbySwipeableProfilesStoreCreator: StateCreator<
  NearbySwipeableProfilesStore,
  [["zustand/immer", never]],
  [["zustand/persist", unknown]]
> = (set, get) => {
  return {
    ...initialState,

    canSwipe: () => {
      const { todaySwipedCounter, firstSwipeTimestamp } = get();
      if (firstSwipeTimestamp === null) return true;
      const now = Date.now();
      // If more than 24h passed since first swipe, allow swipe (counter will reset on next register)
      if (now - firstSwipeTimestamp > 24 * 60 * 60 * 1000) return true;
      return todaySwipedCounter < MAX_SWIPES_PER_DAY;
    },

    registerSwipe: () => {
      set((state) => {
        const now = Date.now();
        // If first swipe or 24h passed, reset counter and timestamp
        if (
          state.firstSwipeTimestamp === null ||
          now - state.firstSwipeTimestamp > 24 * 60 * 60 * 1000
        ) {
          state.todaySwipedCounter = 1;
          state.firstSwipeTimestamp = now;
        } else {
          state.todaySwipedCounter += 1;
        }
      });
    },

    resetSwipeCounterIfNeeded: () => {
      set((state) => {
        if (
          state.firstSwipeTimestamp !== null &&
          Date.now() - state.firstSwipeTimestamp > 24 * 60 * 60 * 1000
        ) {
          state.todaySwipedCounter = 0;
          state.firstSwipeTimestamp = null;
        }
      });
    },

    loadInitialProfiles: (profiles: NearbySwipeableProfile[]) => {
      set((state) => {
        state.nearbySwipeableProfiles = profiles.slice(
          0,
          MAX_SWIPEABLE_PROFILES_BATCH
        );
        state.hasMore = profiles.length > MAX_SWIPEABLE_PROFILES_BATCH;
      });
    },

    swipeProfile: (newProfile: NearbySwipeableProfile | null) => {
      set((state) => {
        // Remove the first profile (the one swiped)
        state.nearbySwipeableProfiles.shift();
        // Add new profile if available
        if (newProfile) {
          state.nearbySwipeableProfiles.push(newProfile);
        }
        // If after swipe there are less than batch size, hasMore should be false
        if (
          state.nearbySwipeableProfiles.length < MAX_SWIPEABLE_PROFILES_BATCH
        ) {
          state.hasMore = false;
        }
      });
    },
  };
};

export const nearbySwipeableProfilesStore =
  create<NearbySwipeableProfilesStore>()(
    persist(immer(nearbySwipeableProfilesStoreCreator), {
      name: "nearby-swipeable-profiles-store",
      storage: zustandAsyncStorage,
      partialize: (state) => ({
        nearbySwipeableProfiles: state.nearbySwipeableProfiles,
        hasMore: state.hasMore,
        todaySwipedCounter: state.todaySwipedCounter,
        firstSwipeTimestamp: state.firstSwipeTimestamp,
      }),
    })
  );
