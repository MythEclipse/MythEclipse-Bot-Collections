import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import * as React from "react";
import { fetchProducts, fetchTenant } from "../api";
import { ProductCard } from "../components/product-card";

export function LandingPage(): React.ReactElement {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <ProductSection />
      <ServerLookup />
      <ClosingCta />
    </main>
  );
}

function Hero(): React.ReactElement {
  return (
    <section className="hero container">
      <div className="hero-copy">
        <p className="eyebrow">MythEclipse Bot Collection</p>
        <h1>
          Your server.
          <br />
          <em>More capable.</em>
        </h1>
        <p className="lead">
          A small, carefully built collection of Discord bots — booster roles, moderation companions, and whatever
          comes next. One dashboard for every server that runs them.
        </p>
        <div className="actions">
          <Link className="button" to="/dashboard">
            Manage a server
          </Link>
          <a className="text-link" href="#products">
            Explore the bots ↓
          </a>
        </div>
      </div>
      <div className="hero-orbit">
        <div className="orbit-ring ring-one" />
        <div className="orbit-ring ring-two" />
        <div className="orbit-core">✦</div>
        <span className="orbit-label label-one">safe by design</span>
        <span className="orbit-label label-two">built for scale</span>
      </div>
    </section>
  );
}

function TrustStrip(): React.ReactElement {
  return (
    <section className="trust container">
      <span>POWERING THE NEXT GENERATION OF</span>
      <b>COMMUNITIES</b>
      <b>CREATORS</b>
      <b>FRIENDS</b>
      <b>TEAMS</b>
    </section>
  );
}

function ProductSection(): React.ReactElement {
  const products = useQuery({ queryKey: ["public", "products"], queryFn: fetchProducts });

  return (
    <section className="section container" id="products">
      <div className="section-heading">
        <div>
          <p className="eyebrow">The collection</p>
          <h2>One home for every bot.</h2>
        </div>
        <p>
          Install the tools you need today. Add more as your community evolves. Every server gets its own isolated
          workspace.
        </p>
      </div>
      <div className="product-grid">
        {products.isPending && <p className="muted">Loading products…</p>}
        {products.isError && <p className="form-error">{products.error.message}</p>}
        {products.data?.bots.map((bot) => (
          <ProductCard key={bot.id} bot={bot} />
        ))}
      </div>
    </section>
  );
}

function ServerLookup(): React.ReactElement {
  const [slug, setSlug] = React.useState("demo-server");
  const [submitted, setSubmitted] = React.useState<string | null>(null);
  const lookup = useQuery({
    queryKey: ["public", "tenant", submitted],
    queryFn: () => fetchTenant(submitted ?? ""),
    enabled: submitted !== null
  });

  return (
    <section className="verify-panel container">
      <div>
        <p className="eyebrow">Public lookup</p>
        <h2>Find your server workspace.</h2>
        <p>Check whether a server has an active MythEclipse workspace.</p>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(slug.trim());
        }}
      >
        <label>
          Server slug
          <input value={slug} onChange={(event) => setSlug(event.target.value)} required />
        </label>
        <button className="button" type="submit" disabled={lookup.isFetching}>
          {lookup.isFetching ? "Checking…" : "Check server"}
        </button>
      </form>
      {lookup.data && (
        <div className="server-result">
          <strong>{lookup.data.tenant.name}</strong>
          <span>
            Active · {lookup.data.tenant.plan} workspace · {lookup.data.tenant.discordGuildId}
          </span>
        </div>
      )}
      {lookup.isError && <p className="form-error server-result">{lookup.error.message}</p>}
    </section>
  );
}

function ClosingCta(): React.ReactElement {
  return (
    <section className="cta container">
      <p className="eyebrow">Ready when you are</p>
      <h2>
        Make your community
        <br />
        <em>feel like yours.</em>
      </h2>
      <Link className="button" to="/dashboard">
        Open your dashboard →
      </Link>
    </section>
  );
}
