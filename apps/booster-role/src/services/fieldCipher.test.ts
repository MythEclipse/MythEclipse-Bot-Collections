import { describe, test } from "node:test";
import { expect } from "expect";
import { FieldCipher } from "./fieldCipher";

const KEY = "test-key-0123456789abcdef0123456789";
const GUILD = "1206212469148749834";

describe("FieldCipher", () => {
  test("round-trips a user id", () => {
    const cipher = new FieldCipher(KEY);
    const stored = cipher.encrypt("352042144430817281", GUILD);

    expect(stored).not.toContain("352042144430817281");
    expect(cipher.decrypt(stored, GUILD)).toBe("352042144430817281");
  });

  test("produces a different ciphertext every time", () => {
    const cipher = new FieldCipher(KEY);
    const a = cipher.encrypt("352042144430817281", GUILD);
    const b = cipher.encrypt("352042144430817281", GUILD);

    expect(a).not.toBe(b);
    expect(cipher.decrypt(a, GUILD)).toBe(cipher.decrypt(b, GUILD));
  });

  test("refuses a ciphertext moved to another guild", () => {
    const cipher = new FieldCipher(KEY);
    const stored = cipher.encrypt("352042144430817281", GUILD);

    expect(cipher.decrypt(stored, "999999999999999999")).toBeNull();
  });

  test("rejects a tampered ciphertext instead of returning wrong plaintext", () => {
    const cipher = new FieldCipher(KEY);
    const stored = cipher.encrypt("352042144430817281", GUILD);
    const parts = stored.split(":");
    const flipped = Buffer.from(parts[3], "base64");
    flipped[0] ^= 0xff;
    parts[3] = flipped.toString("base64");

    expect(cipher.decrypt(parts.join(":"), GUILD)).toBeNull();
  });

  test("returns null for a value written by a different key", () => {
    const written = new FieldCipher("another-key-abcdef0123456789abcd").encrypt("123", GUILD);

    expect(new FieldCipher(KEY).decrypt(written, GUILD)).toBeNull();
  });

  test("refuses to construct without a key", () => {
    expect(() => new FieldCipher("   ")).toThrow("BOOSTER_ENCRYPTION_KEY");
  });

  test("recognises its own output", () => {
    const stored = new FieldCipher(KEY).encrypt("123", GUILD);

    expect(FieldCipher.isEncrypted(stored)).toBe(true);
    expect(FieldCipher.isEncrypted("352042144430817281")).toBe(false);
  });
});
