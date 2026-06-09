import {
  useCallback,
  useEffect,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AuthUIContext } from "@neondatabase/neon-js/auth/react";
import type { TrainingPlan, User, UserProfile } from "../types";
import { api } from "../lib/api";
import { AuthContext } from "./AuthContextValue";

type SessionState = {
  data?: {
    user?: {
      id: string;
      email: string;
      emailVerified?: boolean;
      createdAt?: string | Date;
    } | null;
  } | null;
  isPending?: boolean;
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { hooks } = useContext(AuthUIContext);
  const session = hooks.useSession() as SessionState;
  const sessionUser = session.data?.user ?? null;
  const neonUser: User | null = sessionUser
    ? {
        id: sessionUser.id,
        email: sessionUser.email,
        emailVerified: sessionUser.emailVerified,
        createdAt:
          sessionUser.createdAt instanceof Date
            ? sessionUser.createdAt.toISOString()
            : (sessionUser.createdAt ?? ""),
      }
    : null;
  const neonUserId = neonUser?.id;
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const isRefreshingRef = useRef(false);

  const isLoading = Boolean(session.isPending) || isDataLoading;

  const refreshData = useCallback(async () => {
    if (!neonUserId || isRefreshingRef.current) return;

    isRefreshingRef.current = true;
    setIsDataLoading(true);

    try {
      const planData = await api.getCurrentPlan().catch(() => null);
      if (planData) {
        setPlan({
          id: planData.id,
          userId: planData.userId,
          overview: planData.planJson.overview,
          weeklySchedule: planData.planJson.weeklySchedule,
          progression: planData.planJson.progression,
          version: planData.version,
          createdAt: planData.createdAt,
        });
      } else {
        setPlan(null);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      isRefreshingRef.current = false;
      setIsDataLoading(false);
    }
  }, [neonUserId]);

  useEffect(() => {
    if (session.isPending) return;

    if (neonUserId) {
      refreshData();
    } else {
      setPlan(null);
      setIsDataLoading(false);
    }
  }, [neonUserId, refreshData, session.isPending]);

  async function saveProfile(
    profileData: Omit<UserProfile, "userId" | "updatedAt">,
  ) {
    if (!neonUser) {
      throw new Error("User must be authenticated to save profile");
    }

    if (!neonUser.emailVerified) {
      throw new Error("Please verify your email before saving your profile");
    }

    await api.saveProfile(profileData);
    await refreshData();
  }

  async function generatePlan() {
    if (!neonUser) {
      throw new Error("User must be authenticated to generate plan");
    }

    if (!neonUser.emailVerified) {
      throw new Error("Please verify your email before generating a plan");
    }

    await api.generatePlan();
    await refreshData();
  }

  return (
    <AuthContext.Provider
      value={{
        user: neonUser,
        plan,
        isLoading,
        saveProfile,
        generatePlan,
        refreshData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
