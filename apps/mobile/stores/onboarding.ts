import { create } from "zustand";
import type { Classification } from "@shoptalk/shared";

interface OnboardingState {
  localNumber: number | null;
  classification: Classification | null;
  setLocalNumber: (localNumber: number) => void;
  setClassification: (classification: Classification) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  localNumber: null,
  classification: null,

  setLocalNumber: (localNumber) => set({ localNumber }),
  setClassification: (classification) => set({ classification }),
  reset: () => set({ localNumber: null, classification: null }),
}));
