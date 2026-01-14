import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api";
import type { UserProfile } from "@shoptalk/shared";

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: UserProfile | null) => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,

      setProfile: (profile) => set({ profile }),

      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const profile = await api.get<UserProfile>("/api/user/profile");
          set({ profile, isLoading: false });
        } catch (error) {
          // User might not have a profile yet (during onboarding)
          set({ profile: null, isLoading: false });
        }
      },

      updateProfile: async (updates) => {
        set({ isLoading: true, error: null });
        try {
          const profile = await api.patch<UserProfile>(
            "/api/user/profile",
            updates
          );
          set({ profile, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Update failed",
            isLoading: false,
          });
          throw error;
        }
      },

      clearProfile: () => set({ profile: null, error: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);
