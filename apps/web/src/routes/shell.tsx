import { Link, Outlet } from "@tanstack/react-router";
import * as React from "react";

function Brand(): React.ReactElement {
  return (
    <Link className="brand" to="/">
      dc<span>bot</span>
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
            Products
          </Link>
          <Link to="/support">Support</Link>
          <Link to="/privacy">Privacy</Link>
          <Link className="nav-login" to="/dashboard">
            Admin login ↗
          </Link>
        </nav>
      </header>
      <Outlet />
      <footer className="container footer">
        <div>
          <Brand />
          <p>Thoughtful software for Discord communities.</p>
        </div>
        <div className="footer-links">
          <Link to="/privacy">Privacy policy</Link>
          <Link to="/terms">Terms of service</Link>
          <Link to="/support">Support</Link>
        </div>
        <small>© 2026 dcbot. All rights reserved.</small>
      </footer>
    </>
  );
}
