import { Bullets, Section, Table } from "./blocks";
import { contactEmail, lastUpdated, type AppLegal } from "./types";

const privacyBody = (
  <>
    <p>
      This policy covers the <strong>Booster Role</strong> bot from the MythEclipse Bot Collection, and only that bot.
      Other bots in the collection have their own privacy policy. It explains exactly what the Discord application
      processes when it is installed in a server, which gateway intents it requests, what it stores, and how to have
      that data deleted.
    </p>

    <Section title="Discord gateway intents we request">
      <p>
        Discord groups event access into intents. Booster Role requests the two intents it needs to keep booster roles
        correct, and no others. The privileged intents marked as not requested are deliberately disabled in the
        application settings; enabling one would require a policy change first.
      </p>
      <Table
        head={["Intent", "Requested", "What it is used for", "What we store from it"]}
        rows={[
          [
            "Guilds (standard)",
            "Yes",
            "Receiving slash commands, and reading server, channel, and role metadata (role names, colours, positions, permissions) so a cosmetic role can be created, renamed, recoloured, or deleted.",
            "Role id, role name, role colours, role icon, and the guild id of the server that owns the record."
          ],
          [
            "Server Members (privileged)",
            "Yes",
            "Receiving member join, leave, and role-change events. This is how the bot knows a member gained or lost the configured booster eligibility role, so a custom role is offered, or removed, at the right moment.",
            "The Discord user id of the booster, the guild id, and the role id the bot created for them."
          ],
          [
            "Presence (privileged)",
            "No",
            "Not requested and not enabled. The bot never reads online status, activity, or custom status.",
            "Nothing."
          ],
          [
            "Message Content (privileged)",
            "No",
            "Not requested and not enabled. The bot works only through slash commands, which Discord delivers as interactions with their own payload; it never reads the message stream.",
            "Nothing."
          ]
        ]}
      />
    </Section>

    <Section title="Data we process">
      <Table
        head={["Data", "Why", "Stored"]}
        rows={[
          ["Discord guild (server) id", "To keep each server's data separate.", "Yes, in our database"],
          ["Discord user id of the booster", "To prove the custom role belongs to that member.", "Yes, in our database"],
          ["Discord role id", "To rename, recolour, or delete only the role the bot created.", "Yes, in our database"],
          [
            "Role customisation: name, primary colour, secondary colour, icon image",
            "To apply your choices to the role. An uploaded icon is sent to Discord as the role icon, and a copy is kept with the record so it can be restored.",
            "Yes, in our database"
          ],
          [
            "Timestamps (created / updated)",
            "To keep records consistent and to clean up roles that no longer apply.",
            "Yes, in our database"
          ],
          [
            "Message content, other attachments, presence, activity, voice state, email, IP-based profiles",
            "Not needed for any feature.",
            "Never collected"
          ]
        ]}
      />
    </Section>

    <Section title="How we use the data">
      <Bullets
        items={[
          "Create, rename, recolour, and delete the cosmetic role a booster asked for.",
          "Decide whether a member is currently eligible for a custom role.",
          "Remove a role automatically when the member stops boosting, or when it would otherwise become unsafe.",
          "Reply inside Discord, for example a boost greeting in the configured channel.",
          "Diagnose errors and abuse. We do not build profiles, advertise, or sell anything."
        ]}
      />
    </Section>

    <Section title="What we never do">
      <Bullets
        items={[
          "We do not read, log, or store the content of your messages.",
          "We do not track presence, activity, or who is online.",
          "We do not sell, rent, or share data with advertisers or data brokers.",
          "We do not use third-party analytics or tracking scripts on this website.",
          "We do not grant the bot Administrator, and it never touches roles it did not create."
        ]}
      />
    </Section>

    <Section title="Where the data lives and who can reach it">
      <p>
        Records live in a PostgreSQL database on a server we operate. The bot token and database credentials are held
        in a secrets manager and readable only by the service accounts that run the bot. Host access is limited to the
        operator over SSH keys. Discord itself processes the events and API calls needed to run the features above,
        under its own privacy policy.
      </p>
    </Section>

    <Section title="Retention and deletion">
      <Bullets
        items={[
          <>
            A member can delete their role and its record at any time with <code>/booster-role delete</code>.
          </>,
          "When a member stops boosting, the custom role and its record are deleted automatically.",
          "A server administrator can ask for every record belonging to their server to be deleted by writing to the address below; we delete them and confirm.",
          "Removing the bot from a server stops all processing for that server immediately.",
          "We keep limited security records where the law requires it, and nothing else."
        ]}
      />
    </Section>

    <Section title="Children">
      <p>
        This bot is not directed at children. Discord requires users to be at least 13 years old, or older where local
        law says so, and we do not knowingly keep data about anyone below that age.
      </p>
    </Section>

    <Section title="Changes to this policy">
      <p>
        We update this page when the bot's behaviour changes, for example if a new intent were ever needed. The date at
        the top always reflects the current version, and material changes are announced in the servers that use the
        bot before they take effect.
      </p>
    </Section>

    <Section title="Contact">
      <p>
        Questions, deletion requests, or abuse reports: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. See also
        the <a href="/apps/booster-role/terms">Booster Role terms of service</a>.
      </p>
    </Section>
  </>
);

const termsBody = (
  <>
    <p>
      These terms cover the <strong>Booster Role</strong> bot from the MythEclipse Bot Collection, and only that bot. By
      installing it or using its dashboard, you agree to them. If you do not agree, remove the bot from your server.
    </p>

    <Section title="What the service does">
      <p>
        Booster Role gives members who boost a Discord server a cosmetic role they can name, colour, and add an icon
        to. The role is created by the bot, carries no permissions, and is removed when the member stops being
        eligible.
      </p>
    </Section>

    <Section title="Bot permissions">
      <p>
        The bot asks for <strong>Manage Roles</strong> and nothing more. It creates and edits only roles it created
        itself, keeps them below the configured staff anchor role, and refuses to grant moderation, administrative,
        channel, or integration permissions to any role it manages. You are responsible for keeping the bot's own role
        above the cosmetic roles it manages.
      </p>
    </Section>

    <Section title="Server administrator responsibility">
      <p>
        You must have authority to install bots and configure the server. You are responsible for reviewing role
        positions, permissions, and which administrators have access to your workspace.
      </p>
    </Section>

    <Section title="Acceptable use">
      <Bullets
        items={[
          "Do not use the bot to abuse Discord, evade moderation, or interfere with another server.",
          "Do not attempt to make the bot grant permissions, edit roles it does not own, or exceed its purpose.",
          "Do not use role names or icons to distribute harmful, hateful, or illegal content."
        ]}
      />
    </Section>

    <Section title="Availability and termination">
      <p>
        The service is provided as-is, without warranty, and may change or stop at any time. We may remove access from
        a server that breaks these terms. You can stop using the service at any time by removing the bot, which also
        stops all processing described in the <a href="/apps/booster-role/privacy">Booster Role privacy policy</a>.
      </p>
    </Section>

    <Section title="Contact">
      <p>
        Questions about these terms: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>
    </Section>
  </>
);

export const boosterRoleLegal: AppLegal = {
  slug: "booster-role",
  name: "Booster Role",
  summary: "Cosmetic roles that respect your server.",
  privacy: { updated: lastUpdated, body: privacyBody },
  terms: { updated: lastUpdated, body: termsBody }
};
