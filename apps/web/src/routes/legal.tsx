import { Link, useParams } from "@tanstack/react-router";
import * as React from "react";
import { useLocale } from "../i18n";
import { findLegalApp } from "../legal";
import type { LegalDocumentKind } from "../legal/types";

/**
 * Legal documents are per bot, not per site: each Discord application links to
 * its own terms and privacy URLs, so one shared page would describe the wrong
 * app as soon as the collection grows.
 *
 * The document bodies ship in English only — they are the binding text — so a
 * translated page states that plainly instead of pretending otherwise.
 */
export function LegalDocumentPage({ kind }: { kind: LegalDocumentKind }): React.ReactElement {
  const { t, locale } = useLocale();
  const params = useParams({ strict: false });
  const app = findLegalApp(typeof params.slug === "string" ? params.slug : undefined);

  if (!app) {
    return (
      <LegalShell
        title={t("legal.notFound.title")}
        subtitle={t("legal.notFound.subtitle")}
        body={<NotFoundBody />}
      />
    );
  }

  const document = app[kind];
  const kindLabel = kind === "privacy" ? t("legal.index.policy") : t("legal.index.termsLink");

  return (
    <LegalShell
      crumb={
        <>
          <Link to="/" hash="help">
            {kind === "privacy" ? t("legal.privacy") : t("legal.terms")}
          </Link>
          <span aria-hidden="true"> / </span>
          <span>{app.name}</span>
        </>
      }
      title={`${app.name} — ${kindLabel}`}
      subtitle={`${kind === "privacy" ? t("legal.updated") : t("legal.effective")}: ${document.updated}`}
      notice={locale === "en" ? null : t("legal.notice")}
      body={document.body}
    />
  );
}

function NotFoundBody(): React.ReactElement {
  const { t } = useLocale();

  return (
    <p>
      {t("legal.notFound.body.one")} <Link to="/" hash="help">{t("legal.privacy")}</Link>{" "}
      {t("legal.notFound.body.two")} <Link to="/" hash="help">{t("legal.terms")}</Link>
      {t("legal.notFound.body.three")}
    </p>
  );
}

function LegalShell({
  crumb,
  title,
  subtitle,
  notice,
  body
}: {
  crumb?: React.ReactNode;
  title: string;
  subtitle: string;
  notice?: string | null;
  body: React.ReactNode;
}): React.ReactElement {
  return (
    <main className="legal container" id="main">
      {crumb && <p className="legal-crumb">{crumb}</p>}
      <h1>{title}</h1>
      <p className="legal-date">{subtitle}</p>
      {notice && <p className="legal-notice">{notice}</p>}
      <article>{body}</article>
    </main>
  );
}