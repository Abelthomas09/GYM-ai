import { createInternalNeonAuth } from "@neondatabase/neon-js/auth";

const internalAuthClient = createInternalNeonAuth(
  import.meta.env.VITE_NEON_AUTH_URL,
);

export const authClient = internalAuthClient.adapter;

export function getAuthToken() {
  return internalAuthClient.getJWTToken();
}
