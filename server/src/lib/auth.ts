import type { NextFunction, Request, Response } from "express";

const fallbackAuthUrl =
  "https://ep-polished-hall-apn1r61g.neonauth.c-7.us-east-1.aws.neon.tech/neondb/auth";
const authUrl =
  process.env.NEON_AUTH_URL || process.env.VITE_NEON_AUTH_URL || fallbackAuthUrl;

type AuthPayload = Record<string, unknown>;

let joseModule: Promise<any> | null = null;
let jwks: any = null;

export interface AuthenticatedRequest extends Request {
  authUser?: {
    id: string;
    email?: string;
    emailVerified: boolean;
  };
}

function getJose() {
  joseModule ??= import("jose");
  return joseModule;
}

async function getJwks() {
  if (!authUrl) {
    throw new Error("NEON_AUTH_URL is required for authenticated API routes");
  }

  const { createRemoteJWKSet } = await getJose();

  if (!jwks) {
    const baseUrl = authUrl.endsWith("/") ? authUrl : `${authUrl}/`;
    jwks = createRemoteJWKSet(new URL(".well-known/jwks.json", baseUrl));
  }

  return jwks;
}

function readEmailVerified(payload: AuthPayload) {
  const value =
    payload.emailVerified ??
    payload.email_verified ??
    (payload.user as Record<string, unknown> | undefined)?.emailVerified;

  return value === true || value === "true";
}

export async function requireVerifiedUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorization = req.header("authorization");
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length)
      : null;

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { jwtVerify } = await getJose();
    const { payload } = await jwtVerify(token, await getJwks());
    const userId = payload.sub;

    if (!userId) {
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    const emailVerified = readEmailVerified(payload);

    if (!emailVerified) {
      return res.status(403).json({
        error: "Please verify your email before using this feature.",
      });
    }

    req.authUser = {
      id: userId,
      email: typeof payload.email === "string" ? payload.email : undefined,
      emailVerified,
    };

    next();
  } catch (error) {
    console.error("Auth verification failed:", error);
    res.status(401).json({ error: "Invalid or expired authentication token" });
  }
}
