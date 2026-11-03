import type { BoosterRoleRecord } from "../services/boosterRoleStore";

/**
 * Replies that disclose what the bot stores and how to get it deleted.
 *
 * WHY THESE ARE SUBCOMMANDS AND NOT DOCS: the developer policy asks that users be
 * told about their data, and a link on a website is easy to never see. A member who
 * just ran /booster-role claim can ask the bot itself, in the same place, and get an
 * answer that reflects what is actually stored for them.
 */

export type DisclosureLinks = {
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
  contactEmail: string;
  retentionDays: number;
};

export function privacyMessage(links: DisclosureLinks): string {
  return [
    "**What this bot stores about you**",
    "• your Discord user id — encrypted at rest, and only so the role can be proven to be yours",
    "• the server (guild) id",
    "• the id, name, colours and icon of the role the bot created for you",
    "• when the record was created and last changed",
    "",
    "It does **not** store your username, avatar, messages, presence, activity or email. It reads no message content and no online status.",
    "",
    "**How to have it deleted**",
    "• `/booster-role delete` — deletes your role and its record immediately",
    "• stop boosting — the role and record are removed automatically",
    `• email **${links.contactEmail}** for anything a command cannot cover`,
    "",
    `Records are kept at most **${links.retentionDays} days**, then deleted automatically.`,
    "",
    `Privacy policy: ${links.privacyPolicyUrl}`,
    `Terms of service: ${links.termsOfServiceUrl}`,
  ].join("\n");
}

export function myDataMessage(record: BoosterRoleRecord | null, retentionDays: number): string {
  if (!record) {
    return "This bot stores nothing about you in this server. Claim a role with `/booster-role claim` and a record will exist for as long as you keep it.";
  }

  const created = new Date(record.createdAt).toISOString().slice(0, 10);
  const updated = new Date(record.updatedAt).toISOString().slice(0, 10);

  return [
    "**What this bot stores about you in this server**",
    `• Discord user id: \`${record.userId}\` — stored encrypted, never in plaintext`,
    `• Server id: \`${record.guildId}\``,
    `• Your role: <@&${record.roleId}> (\`${record.roleId}\`)`,
    `• Role name: ${record.name}`,
    `• Colours: ${record.color ?? "default"}${record.color2 ? ` → ${record.color2}` : ""}`,
    `• Icon: ${record.icon ? "set" : "none"}`,
    `• Created: ${created} · last changed: ${updated}`,
    "",
    `Kept at most **${retentionDays} days**, then deleted automatically.`,
    "Delete it now with `/booster-role delete`.",
  ].join("\n");
}
