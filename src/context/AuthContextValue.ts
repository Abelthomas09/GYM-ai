import { createContext } from "react";
import type { TrainingPlan, User, UserProfile } from "../types";

export interface AuthContextType {
  user: User | null;
  plan: TrainingPlan | null;
  isLoading: boolean;
  saveProfile: (
    profile: Omit<UserProfile, "userId" | "updatedAt">,
  ) => Promise<void>;
  generatePlan: () => Promise<void>;
  refreshData: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
