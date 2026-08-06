import { createInternalNeonAuth } from "@neondatabase/neon-js/auth";

const fallbackAuthUrl =
  "https://ep-polished-hall-apn1r61g.neonauth.c-7.us-east-1.aws.neon.tech/neondb/auth";

const internalAuthClient = createInternalNeonAuth(
  import.meta.env.VITE_NEON_AUTH_URL || fallbackAuthUrl,
);

export const authClient = internalAuthClient.adapter;

export function getAuthToken() {
  return internalAuthClient.getJWTToken();
}
