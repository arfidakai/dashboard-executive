import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "dashboard_session";
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

type SessionPayload = {
  username: string;
  expiresAt: number;
};

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  return secret && Buffer.byteLength(secret) >= 32 ? secret : null;
}

export function isAuthConfigured() {
  return Boolean(
    process.env.LOGIN_USERNAME &&
    process.env.LOGIN_PASSWORD &&
    getSessionSecret(),
  );
}

export function safeEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function createSessionToken(username: string) {
  const secret = getSessionSecret();
  if (!secret) throw new Error("SESSION_SECRET must contain at least 32 bytes");

  const payload: SessionPayload = {
    username,
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(encodedPayload).digest("base64url");
  return `${encodedPayload}.${signature}`;
}

function verifySessionToken(token: string | undefined): SessionPayload | null {
  const secret = getSessionSecret();
  const configuredUsername = process.env.LOGIN_USERNAME;
  if (!secret || !configuredUsername || !token) return null;

  const [encodedPayload, signature, extra] = token.split(".");
  if (!encodedPayload || !signature || extra !== undefined) return null;

  const expectedSignature = createHmac("sha256", secret).update(encodedPayload).digest();
  const providedSignature = Buffer.from(signature, "base64url");
  if (providedSignature.length !== expectedSignature.length || !timingSafeEqual(providedSignature, expectedSignature)) {
    return null;
  }

  try {
    const payload: unknown = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    if (!payload || typeof payload !== "object") return null;

    const session = payload as { username?: unknown; expiresAt?: unknown };
    if (
      session.username !== configuredUsername ||
      typeof session.expiresAt !== "number" ||
      session.expiresAt <= Date.now()
    ) {
      return null;
    }

    return { username: session.username, expiresAt: session.expiresAt };
  } catch {
    return null;
  }
}

export async function getAuthenticatedUsername() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token)?.username ?? null;
}

export async function isAuthenticated() {
  return (await getAuthenticatedUsername()) !== null;
}
