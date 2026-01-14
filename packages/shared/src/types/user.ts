import type { Classification } from "../constants/classifications";

export interface UserProfile {
  id: string;
  email: string | null;
  phone: string | null;
  localNumber: number;
  classification: Classification;
  hubId: string | null;
  shift: string | null;
  seniorityDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  localNumber: number;
  classification: Classification;
}

export interface UpdateUserInput {
  localNumber?: number;
  classification?: Classification;
  hubId?: string | null;
  shift?: string | null;
  seniorityDate?: string | null;
}
