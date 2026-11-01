import { Link, useParams } from "@tanstack/react-router";
import * as React from "react";
import { findLegalApp, legalApps } from "../legal";
import type { LegalDocumentKind } from "../legal/types";
import { contactEmail } from "../legal/types";

/**
 * Legal documents are per bot, not per site: each Discord application links to
 * its own terms and privacy URLs, so one shared page would describe the wrong
 * app as soon as the collection grows.
 */
export function LegalDocumentPage({ kind }: { kind: LegalDocumentKind }): React.ReactElement {
  const params = useParams({ strict: false });
  const app = findLegalApp(typeof params.slug === "string" ? params.slug : undefined);

  if (!app) {
    return (
      <LegalShell
        title="Document not found"
        subtitle="No legal document lives at this address."
        body={<NotFoundBody />}
      />
    );
  }

  const document = app[kind];
  return (
    <LegalShell
      eyebrow={`${app.name} · ${kind === "privacy" ? "privacy" : "terms"}`}
      title={`${app.name} ${kind === "privacy" ? "privacy policy" : "terms of service"}`}
      subtitle={`${kind === "privacy" ? "Last updated" : "Effective"}: ${document.updated}`}
      body={document.body}
    />
  );
}

function NotFoundBody(): React.ReactElement {
  return (
    <p>
      Pick a bot from the <Link to="/privacy">privacy</Link> or <Link to="/terms">terms</Link> index.
    </p>
  );
}

/**
 * Collection-level page. It carries the rules that are true for every bot in the
 * collection and links out to each bot's own documents.
 */
export function LegalIndexPage({ kind }: { kind: "privacy" | "terms" }): React.ReactElement {
  const isPrivacy = kind === "privacy";
  return (
    <LegalShell
      eyebrow="MythEclipse Bot Collection"
      title={isPrivacy ? "Privacy" : "Terms"}
      subtitle={
        isPrivacy
          ? "Each bot has its own policy. This page explains the collection around them."
          : "Each bot has its own terms. This page explains the collection around them."
      }
      body={
        <>
          <p>
            {isPrivacy
              ? "MythEclipse Bot Collection is a set of Discord bots run by the same developer. Every bot publishes its own privacy policy, because each one requests different Discord intents and stores different data."
              : "MythEclipse Bot Collection is a set of Discord bots run by the same developer. Every bot publishes its own terms of service, because each one asks for different Discord permissions."}
          </p>

          <section className="legal-section">
            <h2>Bots in the collection</h2>
            <div className="legal-index">
              {legalApps.map((app) => (
                <article key={app.slug} className="legal-index-card">
                  <h3>{app.name}</h3>
                  <p>{app.summary}</p>
                  <div className="legal-index-links">
                    <Link to="/apps/$slug/privacy" params={{ slug: app.slug }}>
                      Privacy policy
                    </Link>
                    <Link to="/apps/$slug/terms" params={{ slug: app.slug }}>
                      Terms of service
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="legal-section">
            <h2>{isPrivacy ? "This website" : "This website"}</h2>
            <p>
              {isPrivacy
                ? "The site you are reading is a static page. It sets no cookies, runs no analytics or tracking scripts, and asks for no account. It calls the collection's own API only to list bots and to load a server dashboard; nothing from that call is shared with a third party."
                : "The site you are reading is informational. Using it does not grant you access to a bot beyond what Discord itself allows, and the bots may be changed or stopped at any time."}
            </p>
          </section>

          <section className="legal-section">
            <h2>Contact and changes</h2>
            <p>
              Questions about any bot or about the collection: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. When
              a bot's behaviour changes, its own page is updated and the date at the top of that page moves with it.
            </p>
          </section>
        </>
      }
    />
  );
}

function LegalShell({
  title,
  subtitle,
  body,
  eyebrow = "MythEclipse"
}: {
  title: string;
  subtitle: string;
  body: React.ReactNode;
  eyebrow?: string;
}): React.ReactElement {
  return (
    <main className="legal container">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="legal-date">{subtitle}</p>
      <article>{body}</article>
    </main>
  );
}
