import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

/**
 * Field-level encryption for the one personal identifier this bot stores: the
 * Discord user id of a booster.
 *
 * WHY FIELD-LEVEL AND NOT DISK-LEVEL: the developer policy requires stored API
 * data to be encrypted at rest. Full-disk encryption (LUKS) would satisfy it, but
 * it protects nothing once the machine is running — any process that can read the
 * database file, a backup, or a `pg_dump` sees plaintext either way. Encrypting the
 * column keeps the identifier unreadable in exactly those places: dumps, backups,
 * and stray copies. It also survives being moved to another host unchanged.
 *
 * WHAT IS NOT ENCRYPTED, AND WHY THAT IS DEFENSIBLE: role id, guild id, role name,
 * colours and icon are not personal data — a role name is a public cosmetic label
 * shown to the whole server, and role/guild ids are public snowflakes. Encrypting
 * them would break the unique indexes that make "one role per member" enforceable
 * and would buy no confidentiality, because the same values are already visible to
 * every member in the Discord client.
 *
 * AES-256-GCM is used rather than CBC so that tampering is detected: a modified
 * ciphertext fails to authenticate instead of decrypting to attacker-chosen
 * plaintext. Every record carries its own random IV, and the guild id is bound in
 * as additional authenticated data, so a ciphertext lifted from one server cannot
 * be replayed into another.
 */

const ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12;
const TAG_BYTES = 16;
const KEY_BYTES = 32;
const VERSION = "v1";
const SEPARATOR = ":";

export class FieldCipher {
  private readonly key: Buffer;

  constructor(secret: string) {
    if (secret.trim().length === 0) {
      throw new Error("BOOSTER_ENCRYPTION_KEY is required to store personal data");
    }
    this.key = deriveKey(secret);
  }

  /**
   * Encrypts `plaintext`, binding it to `context` (the guild id). The context is
   * authenticated but not stored, so decryption must supply the same value.
   */
  encrypt(plaintext: string, context: string): string {
    const iv = randomBytes(IV_BYTES);
    const cipher = createCipheriv(ALGORITHM, this.key, iv);
    cipher.setAAD(Buffer.from(context, "utf8"));

    const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();

    return [VERSION, iv.toString("base64"), tag.toString("base64"), ciphertext.toString("base64")].join(SEPARATOR);
  }

  /**
   * Reverses `encrypt`. Returns null for a value this key cannot authenticate,
   * rather than throwing: a single unreadable row must not take down the whole
   * cleanup cycle, and the caller decides what a null means.
   */
  decrypt(stored: string, context: string): string | null {
    const parts = stored.split(SEPARATOR);
    if (parts.length !== 4 || parts[0] !== VERSION) return null;

    const [, ivPart, tagPart, cipherPart] = parts;
    try {
      const decipher = createDecipheriv(ALGORITHM, this.key, Buffer.from(ivPart, "base64"));
      decipher.setAAD(Buffer.from(context, "utf8"));
      decipher.setAuthTag(Buffer.from(tagPart, "base64"));

      const plaintext = Buffer.concat([
        decipher.update(Buffer.from(cipherPart, "base64")),
        decipher.final(),
      ]);
      return plaintext.toString("utf8");
    } catch {
      return null;
    }
  }

  /** True when `value` already looks like output of `encrypt`. */
  static isEncrypted(value: string): boolean {
    const parts = value.split(SEPARATOR);
    return parts.length === 4 && parts[0] === VERSION;
  }
}

/**
 * Derives a 32-byte key from the configured secret.
 *
 * A fixed salt is acceptable here because the input is a high-entropy key from the
 * secrets manager, not a user-chosen password: the salt exists to make the KDF
 * deterministic across restarts, not to defend against a dictionary. Using a random
 * salt per deployment would mean the key changes whenever the row is written by a
 * different instance, which silently breaks decryption.
 */
function deriveKey(secret: string): Buffer {
  const derived = scryptSync(secret, "mytheclipse.booster-role.user-id", KEY_BYTES);
  return derived.subarray(0, KEY_BYTES);
}

export { TAG_BYTES };
