import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import * as React from "react";
import { fetchProducts } from "../api";
import { legalApps } from "../legal";
import { contactEmail } from "../legal/types";
import { ProductCard } from "../components/product-card";
import { useLocale } from "../i18n";

export function LandingPage(): React.ReactElement {
  return (
    <main id="main">
      <Hero />
      <ProductSection />
      <HelpSection />
      <ClosingCta />
    </main>
  );
}

function Hero(): React.ReactElement {
  const { t } = useLocale();

  return (
    <section className="hero container">
      <div>
        <h1 className="hero-title">
          {t("landing.hero.line1")}
          <em>{t("landing.hero.line2")}</em>
        </h1>
        <p className="hero-lead">{t("landing.hero.lead")}</p>
        <div className="hero-actions">
          <Link className="button" to="/dashboard">
            {t("landing.hero.cta")}
          </Link>
          <a className="text-link" href="#products">
            {t("landing.hero.secondary")}
          </a>
        </div>
      </div>
      <div className="hero-orbit">
        <div className="orbit-ring ring-one" />
        <div className="orbit-ring ring-two" />
        <figure className="hero-proof">
          <p className="proof-command">/booster-role claim</p>
          <ul className="proof-options">
            <li>
              <span>name</span>
              <b>&lt;member&gt;</b>
            </li>
            <li>
              <span>color</span>
              <b>
                <i className="proof-swatch" aria-hidden="true" />
                #c6f36b
              </b>
            </li>
          </ul>
          <p className="proof-result">{t("proof.result")}</p>
          <figcaption>{t("proof.caption")}</figcaption>
        </figure>
      </div>
    </section>
  );
}

function ProductSection(): React.ReactElement {
  const { t } = useLocale();
  const products = useQuery({ queryKey: ["public", "products"], queryFn: fetchProducts });

  return (
    <section className="section container" id="products">
      <div className="section-head">
        <h2>{t("products.heading")}</h2>
        <p>{t("products.body")}</p>
      </div>
      <div className="product-grid">
        {products.isPending && <p className="muted">{t("products.loading")}</p>}
        {products.isError && (
          <div className="form-error error-note" role="alert">
            <p>{t("products.error")}</p>
            <p className="error-detail">{products.error.message}</p>
            <button className="text-link" type="button" onClick={() => void products.refetch()}>
              {t("products.retry")}
            </button>
          </div>
        )}
        {products.data && products.data.bots.length === 0 && <p className="empty">{t("products.empty")}</p>}
        {products.data?.bots.map((bot) => (
          <ProductCard key={bot.id} bot={bot} />
        ))}
      </div>
    </section>
  );
}

/**
 * Support, privacy and terms live on this page instead of three routes: they are
 * three short answers, not three destinations. The binding documents stay per
 * bot at /apps/$slug, because each Discord application must point at its own.
 */
function HelpSection(): React.ReactElement {
  const { t } = useLocale();

  return (
    <section className="section container" id="help">
      <div className="section-head">
        <h2>{t("help.heading")}</h2>
        <p>{t("help.body")}</p>
      </div>
      <div className="help-grid">
        <article className="panel help-card">
          <h3>{t("support.h1")}</h3>
          <p>{t("support.body")}</p>
          <ul className="help-list">
            <li>{t("support.before.one")}</li>
            <li>{t("support.before.two")}</li>
            <li>{t("support.before.three")}</li>
          </ul>
          <p className="support-card">
            {t("support.emailLabel")}{" "}
            <a href={`mailto:${contactEmail}`}>
              <strong>{contactEmail}</strong>
            </a>
          </p>
        </article>

        <article className="panel help-card">
          <h3>{t("legal.privacy")}</h3>
          <p>{t("legal.index.privacy.body")}</p>
          <p>{t("legal.index.privacy.site")}</p>
          <ul className="help-list help-links">
            {legalApps.map((app) => (
              <li key={app.slug}>
                <Link to="/apps/$slug/privacy" params={{ slug: app.slug }}>
                  {app.name} — {t("legal.index.policy")} →
                </Link>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel help-card">
          <h3>{t("legal.terms")}</h3>
          <p>{t("legal.index.terms.body")}</p>
          <p>{t("legal.index.terms.site")}</p>
          <ul className="help-list help-links">
            {legalApps.map((app) => (
              <li key={app.slug}>
                <Link to="/apps/$slug/terms" params={{ slug: app.slug }}>
                  {app.name} — {t("legal.index.termsLink")} →
                </Link>
              </li>
            ))}
          </ul>
        </article>
      </div>
      <p className="muted">{t("legal.index.contact.body", { email: contactEmail })}</p>
    </section>
  );
}

function ClosingCta(): React.ReactElement {
  const { t } = useLocale();

  return (
    <section className="cta container">
      <h2>
        {t("cta.line1")}
        <br />
        <em>{t("cta.line2")}</em>
      </h2>
      <p>{t("cta.body")}</p>
      <Link className="button" to="/dashboard">
        {t("cta.button")}
      </Link>
    </section>
  );
}