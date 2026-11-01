import { Link, Outlet } from "@tanstack/react-router";
import * as React from "react";
import { localeNames, locales, useLocale, type Locale } from "../i18n";
import { useTheme } from "../theme";

/** One wordmark, one link. A second copy in the footer would only add noise. */
function Brand({ as }: { as: "link" | "text" }): React.ReactElement {
  const { t } = useLocale();
  const content = (
    <>
      MythEclipse
      <small className="brand-tag">{t("brand.tag")}</small>
    </>
  );

  return as === "link" ? (
    <Link className="brand" to="/">
      {content}
    </Link>
  ) : (
    <span className="brand">{content}</span>
  );
}

function ThemeToggle(): React.ReactElement {
  const { t } = useLocale();
  const { theme, toggle } = useTheme();
  const label = theme === "dark" ? t("nav.theme.toLight") : t("nav.theme.toDark");

  return (
    <button className="icon-button" type="button" onClick={toggle} aria-label={label} title={label}>
      <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
    </button>
  );
}

function LanguageSwitch(): React.ReactElement {
  const { t, locale, setLocale } = useLocale();

  return (
    <div className="lang-switch" role="group" aria-label={t("nav.language")}>
      {locales.map((option: Locale) => (
        <button key={option} type="button" aria-pressed={locale === option} onClick={() => setLocale(option)} lang={option}>
          {localeNames[option]}
        </button>
      ))}
    </div>
  );
}

export function Shell(): React.ReactElement {
  const { t } = useLocale();

  return (
    <>
      <a className="skip-link" href="#main">
        {t("skip.link")}
      </a>
      <header className="nav container">
        <Brand as="link" />
        <div className="nav-right">
          <nav className="nav-links" aria-label={t("nav.primaryLabel")}>
            <Link to="/" hash="products">
              {t("nav.bots")}
            </Link>
            <Link to="/" hash="help">
              {t("nav.support")}
            </Link>
            <Link className="nav-login" to="/dashboard">
              {t("nav.signIn")}
            </Link>
          </nav>
          <div className="nav-tools">
            <LanguageSwitch />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <Outlet />
      <footer className="footer container">
        <div>
          <Brand as="text" />
          <p>{t("footer.blurb")}</p>
        </div>
        <nav className="footer-links" aria-label={t("footer.legalLabel")}>
          <Link to="/" hash="help">
            {t("footer.helpLink")}
          </Link>
        </nav>
        <small>{t("footer.copyright", { year: new Date().getFullYear() })}</small>
      </footer>
    </>
  );
}
