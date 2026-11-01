import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import * as React from "react";
import { fetchProducts, fetchTenant } from "../api";
import { ProductCard } from "../components/product-card";
import { useLocale } from "../i18n";

export function LandingPage(): React.ReactElement {
  return (
    <main id="main">
      <Hero />
      <ProductSection />
      <ServerLookup />
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

function ServerLookup(): React.ReactElement {
  const { t } = useLocale();
  const [value, setValue] = React.useState("");
  const [submitted, setSubmitted] = React.useState<string | null>(null);
  const lookup = useQuery({
    queryKey: ["public", "tenant", submitted],
    queryFn: () => fetchTenant(submitted ?? ""),
    enabled: submitted !== null && submitted.length > 0,
    retry: false
  });

  function clear(): void {
    setValue("");
    setSubmitted(null);
  }

  return (
    <section className="section container">
      <div className="panel lookup">
        <div>
          <h2>{t("lookup.heading")}</h2>
          <p>{t("lookup.body")}</p>
        </div>
        <form
          className="lookup-form"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(value.trim());
          }}
        >
          <label className="field">
            {t("lookup.label")}
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="demo-server"
              autoComplete="off"
              required
            />
          </label>
          <button className="button" type="submit" disabled={lookup.isFetching}>
            {lookup.isFetching ? t("lookup.checking") : t("lookup.submit")}
          </button>
        </form>
        {lookup.data && (
          <div className="server-result">
            <div>
              <strong>{lookup.data.tenant.name}</strong>
              <span>
                {t("lookup.meta", {
                  state: lookup.data.tenant.active ? t("lookup.active") : t("lookup.inactive"),
                  plan: lookup.data.tenant.plan,
                  guild: lookup.data.tenant.discordGuildId
                })}
              </span>
            </div>
          </div>
        )}
        {lookup.isError && (
          <p className="form-error server-result" role="alert">
            {t("lookup.miss")}
          </p>
        )}
        {submitted !== null && (lookup.data !== undefined || lookup.isError) && (
          <div className="result-actions">
            {lookup.data && (
              <Link className="text-link" to="/dashboard">
                {t("lookup.open")}
              </Link>
            )}
            <button className="text-link" type="button" onClick={clear}>
              {t("lookup.clear")}
            </button>
          </div>
        )}
      </div>
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
