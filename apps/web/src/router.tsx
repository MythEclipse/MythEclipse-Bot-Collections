import { Link, createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import * as React from "react";
import { DashboardPage } from "./routes/dashboard";
import { LandingPage } from "./routes/landing";
import { LegalPage } from "./routes/legal";
import { Shell } from "./routes/shell";

function NotFound(): React.ReactElement {
  return (
    <main className="legal container">
      <p className="eyebrow">404</p>
      <h1>This page drifted away.</h1>
      <p className="legal-date">
        The link may be old. <Link to="/">Back to the landing page</Link>.
      </p>
    </main>
  );
}

const rootRoute = createRootRoute({ component: Shell, notFoundComponent: NotFound });
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: LandingPage });
const dashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: "/dashboard", component: DashboardPage });
const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: () => <LegalPage kind="privacy" />
});
const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: () => <LegalPage kind="terms" />
});
const supportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/support",
  component: () => <LegalPage kind="support" />
});

const routeTree = rootRoute.addChildren([indexRoute, dashboardRoute, privacyRoute, termsRoute, supportRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
