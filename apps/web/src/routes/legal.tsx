import * as React from "react";

type LegalKind = "privacy" | "terms" | "support";

const pages: Record<LegalKind, { title: string; date: string; body: React.ReactElement }> = {
  privacy: {
    title: "Privacy policy",
    date: "Last updated: November 1, 2026",
    body: (
      <>
        <p>This policy explains what dcbot collects when you use our Discord bots, website, and server dashboard.</p>
        <h2>Information we process</h2>
        <p>
          We process Discord identifiers needed to identify your account, server, and bot configuration. We store
          server settings and bot-managed data only to provide the features requested by a server administrator.
        </p>
        <h2>Retention and deletion</h2>
        <p>
          Server administrators can request deletion of their workspace. We retain limited security records when
          required to prevent abuse or comply with law.
        </p>
      </>
    )
  },
  terms: {
    title: "Terms of service",
    date: "Effective: November 1, 2026",
    body: (
      <>
        <p>
          By installing or using a dcbot product, you agree to use it lawfully and to keep your Discord account and
          server permissions secure.
        </p>
        <h2>Server administrator responsibility</h2>
        <p>
          You must have authority to install bots and configure a server. You are responsible for reviewing role
          positions, permissions, and administrators granted access to your workspace.
        </p>
        <h2>Acceptable use</h2>
        <p>
          Do not use the platform to abuse Discord, evade moderation, distribute harmful content, or interfere with
          another server.
        </p>
      </>
    )
  },
  support: {
    title: "Support center",
    date: "We help server admins keep things moving.",
    body: (
      <>
        <p>
          Tell us what happened and include your server ID, workspace ID, and the bot feature involved. Do not send bot
          tokens or passwords.
        </p>
        <h2>Before contacting us</h2>
        <ul>
          <li>Confirm the bot is still in the server.</li>
          <li>Check that the bot role is above managed cosmetic roles.</li>
          <li>Review the dashboard activity and server permissions.</li>
        </ul>
        <p className="support-card">
          Support email placeholder
          <br />
          <strong>support@example.com</strong>
        </p>
      </>
    )
  }
};

export function LegalPage({ kind }: { kind: LegalKind }): React.ReactElement {
  const page = pages[kind];
  return (
    <main className="legal container">
      <p className="eyebrow">dcbot</p>
      <h1>{page.title}</h1>
      <p className="legal-date">{page.date}</p>
      <article>{page.body}</article>
    </main>
  );
}
