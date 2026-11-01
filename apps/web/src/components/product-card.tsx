import type { BotProduct } from "@mytheclipse/contracts";
import { Link } from "@tanstack/react-router";
import * as React from "react";
import { useLocale } from "../i18n";

/**
 * The card carries the bot's own accent from the API payload, so a new bot
 * brings its own hue without a stylesheet change.
 */
export function ProductCard({ bot }: { bot: BotProduct }): React.ReactElement {
  const { t } = useLocale();
  const available = bot.status === "available";

  return (
    <article className="product-card" style={{ "--accent": bot.accent } as React.CSSProperties}>
      <div className="product-head">
        <h3>{bot.name}</h3>
        <span className="product-status">{available ? t("product.available") : t("product.comingSoon")}</span>
      </div>
      <p className="product-tagline">{bot.tagline}</p>
      <p>{bot.description}</p>
      {bot.command && <code className="product-command">{bot.command}</code>}
      {available && (
        <Link className="product-link" to="/dashboard">
          {t("product.manage")}
        </Link>
      )}
    </article>
  );
}
