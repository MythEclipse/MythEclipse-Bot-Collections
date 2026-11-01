import * as React from "react";

export type LegalKind = "privacy" | "terms" | "support";

const contactEmail = "asepharyana@gmail.com";
const lastUpdated = "November 1, 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }): React.ReactElement {
  return (
    <section className="legal-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }): React.ReactElement {
  return (
    <div className="legal-table-wrap">
      <table>
        <thead>
          <tr>
            {head.map((cell) => (
              <th key={cell}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PrivacyPolicy(): React.ReactElement {
  return (
    <>
      <p>
        dcbot is a small Discord bot platform run by an individual developer (contact below). This policy explains
        exactly what the dcbot Discord application processes when it is installed in a server, which Discord gateway
        intents it requests, what it stores, and how to have that data deleted. It covers the bot, this website, and
        the server dashboard.
      </p>

      <Section title="Discord gateway intents we request">
        <p>
          Discord groups event access into intents. dcbot requests the two intents it needs to keep booster roles
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
              "Receiving member join, leave, and role-change events. This is how dcbot knows a member gained or lost the configured booster eligibility role, so a custom role is offered, or removed, at the right moment.",
              "The Discord user id of the booster, the guild id, and the role id dcbot created for them."
            ],
            [
              "Presence (privileged)",
              "No",
              "Not requested and not enabled. dcbot never reads online status, activity, or custom status.",
              "Nothing."
            ],
            [
              "Message Content (privileged)",
              "No",
              "Not requested and not enabled. dcbot works only through slash commands, which Discord delivers as interactions with their own payload; it never reads the message stream.",
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
            ["Discord role id", "To rename, recolour, or delete only the role dcbot created.", "Yes, in our database"],
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
        <ul>
          <li>Create, rename, recolour, and delete the cosmetic role a booster asked for.</li>
          <li>Decide whether a member is currently eligible for a custom role.</li>
          <li>Remove a role automatically when the member stops boosting, or when it would otherwise become unsafe.</li>
          <li>Reply inside Discord, for example a boost greeting in the configured channel.</li>
          <li>Diagnose errors and abuse. We do not build profiles, advertise, or sell anything.</li>
        </ul>
      </Section>

      <Section title="What we never do">
        <ul>
          <li>We do not read, log, or store the content of your messages.</li>
          <li>We do not track presence, activity, or who is online.</li>
          <li>We do not sell, rent, or share data with advertisers or data brokers.</li>
          <li>We do not use third-party analytics or tracking scripts on this website.</li>
          <li>We do not grant the bot Administrator, and it never touches roles it did not create.</li>
        </ul>
      </Section>

      <Section title="Where the data lives and who can reach it">
        <p>
          Records live in a PostgreSQL database on a server we operate. The bot token and database credentials are
          held in a secrets manager and readable only by the service accounts that run the bot. Host access is limited
          to the operator over SSH keys. Discord itself processes the events and API calls needed to run the features
          above, under its own privacy policy.
        </p>
      </Section>

      <Section title="Retention and deletion">
        <ul>
          <li>
            A member can delete their role and its record at any time with <code>/booster-role delete</code>.
          </li>
          <li>When a member stops boosting, the custom role and its record are deleted automatically.</li>
          <li>
            A server administrator can ask for every record belonging to their server to be deleted by writing to the
            address below; we delete them and confirm.
          </li>
          <li>Removing dcbot from a server stops all processing for that server immediately.</li>
          <li>We keep limited security records where the law requires it, and nothing else.</li>
        </ul>
      </Section>

      <Section title="Children">
        <p>
          dcbot is not directed at children. Discord requires users to be at least 13 years old, or older where local
          law says so, and we do not knowingly keep data about anyone below that age.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          We update this page when the bot's behaviour changes, for example if a new intent were ever needed. The date
          at the top always reflects the current version, and material changes are announced in the servers that use
          dcbot before they take effect.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions, deletion requests, or abuse reports: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. See
          also our <a href="/terms">terms of service</a>.
        </p>
      </Section>
    </>
  );
}

function TermsOfService(): React.ReactElement {
  return (
    <>
      <p>
        These terms cover the dcbot Discord application and this website. By installing the bot or using the
        dashboard, you agree to them. If you do not agree, remove the bot from your server.
      </p>

      <Section title="What the service does">
        <p>
          dcbot gives members who boost a Discord server a cosmetic role they can name, colour, and add an icon to.
          The role is created by the bot, carries no permissions, and is removed when the member stops being eligible.
        </p>
      </Section>

      <Section title="Bot permissions">
        <p>
          The bot asks for <strong>Manage Roles</strong> and nothing more. It creates and edits only roles it created
          itself, keeps them below the configured staff anchor role, and refuses to grant moderation, administrative,
          channel, or integration permissions to any role it manages. You are responsible for keeping the bot's own
          role above the cosmetic roles it manages.
        </p>
      </Section>

      <Section title="Server administrator responsibility">
        <p>
          You must have authority to install bots and configure the server. You are responsible for reviewing role
          positions, permissions, and which administrators have access to your workspace.
        </p>
      </Section>

      <Section title="Acceptable use">
        <ul>
          <li>Do not use dcbot to abuse Discord, evade moderation, or interfere with another server.</li>
          <li>Do not attempt to make the bot grant permissions, edit roles it does not own, or exceed its purpose.</li>
          <li>Do not use role names or icons to distribute harmful, hateful, or illegal content.</li>
        </ul>
      </Section>

      <Section title="Availability and termination">
        <p>
          The service is provided as-is, without warranty, and may change or stop at any time. We may remove access
          from a server that breaks these terms. You can stop using the service at any time by removing the bot, which
          also stops all processing described in our <a href="/privacy">privacy policy</a>.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about these terms: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </Section>
    </>
  );
}

function SupportCenter(): React.ReactElement {
  return (
    <>
      <p>
        Tell us what happened and include your server id, the workspace id shown in the dashboard, and the command you
        used. Never send your bot token or password.
      </p>

      <Section title="Before contacting us">
        <ul>
          <li>Confirm dcbot is still in the server and its role sits above the cosmetic roles it manages.</li>
          <li>Confirm the member still has the booster eligibility role, otherwise their role is removed on purpose.</li>
          <li>Check the dashboard for the workspace state and the last update time.</li>
        </ul>
      </Section>

      <Section title="Contact">
        <p className="support-card">
          Support email
          <br />
          <a href={`mailto:${contactEmail}`}>
            <strong>{contactEmail}</strong>
          </a>
        </p>
        <p>
          For how data is handled see the <a href="/privacy">privacy policy</a>; for the rules of use, the{" "}
          <a href="/terms">terms of service</a>.
        </p>
      </Section>
    </>
  );
}

const pages: Record<LegalKind, { title: string; subtitle: string; body: React.ReactElement }> = {
  privacy: { title: "Privacy policy", subtitle: `Last updated: ${lastUpdated}`, body: <PrivacyPolicy /> },
  terms: { title: "Terms of service", subtitle: `Effective: ${lastUpdated}`, body: <TermsOfService /> },
  support: { title: "Support center", subtitle: "We help server admins keep things moving.", body: <SupportCenter /> }
};

export function LegalPage({ kind }: { kind: LegalKind }): React.ReactElement {
  const page = pages[kind];
  return (
    <main className="legal container">
      <p className="eyebrow">dcbot</p>
      <h1>{page.title}</h1>
      <p className="legal-date">{page.subtitle}</p>
      <article>{page.body}</article>
    </main>
  );
}
