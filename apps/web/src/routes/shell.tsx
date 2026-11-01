import { Link, Outlet } from "@tanstack/react-router";
import * as React from "react";

function Brand(): React.ReactElement {
  return (
    <Link className="brand" to="/">
      Myth<span>Eclipse</span>
      <small className="brand-tag">Bot Collection</small>
    </Link>
  );
}

export function Shell(): React.ReactElement {
  return (
    <>
      <header className="nav container">
        <Brand />
        <nav>
          <Link to="/" hash="products">
            Bots
          </Link>
          <Link to="/support">Support</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link className="nav-login" to="/dashboard">
            Admin login ↗
          </Link>
        </nav>
      </header>
      <Outlet />
      <footer className="container footer">
        <div>
          <Brand />
          <p>Discord bots by MythEclipse. Each bot has its own terms and privacy policy.</p>
        </div>
        <div className="footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/support">Support</Link>
        </div>
        <small>© 2026 MythEclipse. All rights reserved.</small>
      </footer>
    </>
  );
}
