import * as React from "react";
import { Section, Bullets } from "../legal/blocks";
import { contactEmail } from "../legal/types";

export function SupportPage(): React.ReactElement {
  return (
    <main className="legal container">
      <p className="eyebrow">MythEclipse Bot Collection</p>
      <h1>Support center</h1>
      <p className="legal-date">We help server admins keep things moving.</p>
      <article>
        <p>
          Tell us what happened and include your server id, the workspace id shown in the dashboard, and the command
          you used. Never send your bot token or password.
        </p>

        <Section title="Before contacting us">
          <Bullets
            items={[
              "Confirm the bot is still in the server and its role sits above the roles it manages.",
              "Confirm the member still has the booster eligibility role, otherwise their role is removed on purpose.",
              "Check the dashboard for the workspace state and the last update time."
            ]}
          />
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
            For how data is handled see each bot's privacy policy; for the rules of use, its terms of service.
          </p>
        </Section>
      </article>
    </main>
  );
}
