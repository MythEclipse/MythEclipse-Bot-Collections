import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { SessionUser } from "@booster-role/contracts";

export type Session = {
  user: SessionUser;
  expiresAt: number;
};

export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const SESSION_COOKIE = "dcbot_session";
export const STATE_COOKIE = "dcbot_oauth_state";
export const STATE_TTL_SECONDS = 600;

/** `<base64url(json)>.<base64url(hmac)>` — stateless, so no session table. */
export function signSession(secret: string, session: Session): string {
  const payload = toBase64Url(JSON.stringify(session));
  return `${payload}.${toBase64Url(sign(secret, payload))}`;
}

export function verifySession(secret: string, token: string | undefined, now = Date.now()): Session | null {
  if (!token) return null;
  const [payload, signature, ...rest] = token.split(".");
  if (!payload || !signature || rest.length > 0) return null;

  const expected = sign(secret, payload);
  const given = fromBase64Url(signature);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;

  const parsed = parseSession(fromBase64Url(payload).toString("utf8"));
  if (!parsed || parsed.expiresAt <= now) return null;
  return parsed;
}

export function randomToken(bytes = 24): string {
  return toBase64Url(randomBytes(bytes));
}

function parseSession(raw: string): Session | null {
  try {
    const value = JSON.parse(raw) as Partial<Session>;
    const user = value.user;
    if (!user || typeof user.id !== "string" || typeof user.name !== "string") return null;
    if (typeof value.expiresAt !== "number") return null;
    return { user: { id: user.id, name: user.name }, expiresAt: value.expiresAt };
  } catch {
    return null;
  }
}

function sign(secret: string, payload: string): Buffer {
  return createHmac("sha256", secret).update(payload).digest();
}

function toBase64Url(value: string | Buffer): string {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string): Buffer {
  return Buffer.from(value, "base64url");
}
