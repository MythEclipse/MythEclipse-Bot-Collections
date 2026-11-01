import { describe, test } from "node:test";
import { expect } from "expect";
import { signSession, verifySession } from "./session";

const secret = "test-secret";
const session = { user: { id: "user-1", name: "MythEclipse" }, expiresAt: 2_000 };

describe("session cookie", () => {
  test("round-trips a signed session", () => {
    expect(verifySession(secret, signSession(secret, session), 1_000)).toEqual(session);
  });

  test("rejects a token signed with another secret", () => {
    expect(verifySession("other-secret", signSession(secret, session), 1_000)).toBeNull();
  });

  test("rejects a tampered payload", () => {
    const token = signSession(secret, session);
    const [, signature] = token.split(".");
    const forgedPayload = Buffer.from(JSON.stringify({ user: { id: "admin", name: "x" }, expiresAt: 2_000 })).toString(
      "base64url"
    );
    expect(verifySession(secret, `${forgedPayload}.${signature}`, 1_000)).toBeNull();
  });

  test("rejects an expired session", () => {
    expect(verifySession(secret, signSession(secret, session), 2_000)).toBeNull();
  });

  test("rejects malformed and missing tokens", () => {
    expect(verifySession(secret, undefined, 1_000)).toBeNull();
    expect(verifySession(secret, "onlypayload", 1_000)).toBeNull();
    expect(verifySession(secret, "a.b.c", 1_000)).toBeNull();
    expect(verifySession(secret, `${Buffer.from("not json").toString("base64url")}.x`, 1_000)).toBeNull();
  });
});
