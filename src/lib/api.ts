import type { UserProfile } from "../types";
import { getAuthToken } from "./auth";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function getAuthHeaders() {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("You must be signed in to continue");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

async function post(path: string, body: object) {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok)
    throw new Error(
      (await res.json().catch(() => ({}))).error || "Request failed",
    );

  return res.json();
}

async function get(path: string) {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: await getAuthHeaders(),
  });
  if (!res.ok)
    throw new Error(
      (await res.json().catch(() => ({}))).error || "Request failed",
    );
  return res.json();
}
export const api = {
  saveProfile: (profile: Omit<UserProfile, "userId" | "updatedAt">) => {
    return post("/profile", profile);
  },

  generatePlan: () => {
    return post("/plan/generate", {});
  },

  getCurrentPlan: () => {
    return get("/plan/current");
  },
};
