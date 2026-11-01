import type { BotProduct } from "@mytheclipse/contracts";
import { Link } from "@tanstack/react-router";
import * as React from "react";

export function ProductCard({ bot }: { bot: BotProduct }): React.ReactElement {
  return (
    <article className="product-card" style={{ "--accent": bot.accent } as React.CSSProperties}>
      <div className="product-icon">✦</div>
      <span className="product-status">{bot.status === "available" ? "Available now" : "Coming soon"}</span>
      <h3>{bot.name}</h3>
      <p className="product-tagline">{bot.tagline}</p>
      <p>{bot.description}</p>
      <Link to={bot.status === "available" ? "/dashboard" : "/support"}>
        {bot.status === "available" ? "Manage bot →" : "Ask about the waitlist →"}
      </Link>
    </article>
  );
}
