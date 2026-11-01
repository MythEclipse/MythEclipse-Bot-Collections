import { Link, createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import * as React from "react";
import { DashboardPage } from "./routes/dashboard";
import { LandingPage } from "./routes/landing";
import { LegalDocumentPage, LegalIndexPage } from "./routes/legal";
import { Shell } from "./routes/shell";
import { SupportPage } from "./routes/support";
import { useLocale } from "./i18n";

function NotFound(): React.ReactElement {
  const { t } = useLocale();

  return (
    <main className="legal container" id="main">
      <h1>{t("notFound.h1")}</h1>
      <p className="legal-date">
        {t("notFound.body")} <Link to="/">{t("notFound.back")}</Link>.
      </p>
    </main>
  );
}

const rootRoute = createRootRoute({ component: Shell, notFoundComponent: NotFound });
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: LandingPage });
const dashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: "/dashboard", component: DashboardPage });
const supportRoute = createRoute({ getParentRoute: () => rootRoute, path: "/support", component: SupportPage });
const privacyIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: () => <LegalIndexPage kind="privacy" />
});
const termsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: () => <LegalIndexPage kind="terms" />
});
// Per-bot documents: each Discord application points at its own pair of URLs.
const appPrivacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/apps/$slug/privacy",
  component: () => <LegalDocumentPage kind="privacy" />
});
const appTermsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/apps/$slug/terms",
  component: () => <LegalDocumentPage kind="terms" />
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  supportRoute,
  privacyIndexRoute,
  termsIndexRoute,
  appPrivacyRoute,
  appTermsRoute
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
