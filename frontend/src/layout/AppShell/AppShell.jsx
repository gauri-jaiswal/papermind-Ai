import React, { useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./AppShell.scss";
import { removeUser } from "../../utils/localStorage";

const navItems = [
  { to: "/default/bot-list", label: "Bots", icon: "bi-robot" },
  { to: "/default/doc-upload", label: "Documents", icon: "bi-cloud-upload" },
];

export default function AppShell({ children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = useMemo(() => {
    if (location.pathname.includes("/default/bot-list")) return "Your Bots";
    if (location.pathname.includes("/default/doc-upload")) return "Documents";
    if (location.pathname.includes("/default/chat")) return "Chat";
    return "Dashboard";
  }, [location.pathname]);

  const onLogout = () => {
    removeUser();
    navigate("/login");
  };

  return (
    <div className="pm-shell">
      <aside className={`pm-sidebar ${open ? "is-open" : ""}`}>
        <div className="pm-brand">
          <Link to="/default/bot-list" className="pm-brand-link">
            <span className="pm-logo">PM</span>
            <span className="pm-brand-text">
              Paper<span className="accent">Mind</span>
            </span>
          </Link>
          <button
            className="pm-icon-btn d-lg-none"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            type="button"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <nav className="pm-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `pm-nav-item ${isActive ? "active" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              <i className={`bi ${item.icon}`} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="pm-sidebar-footer">
          <button className="pm-logout" type="button" onClick={onLogout}>
            <i className="bi bi-box-arrow-right" />
            <span>Sign out</span>
          </button>
          <div className="pm-footnote">v1 • FastAPI + React</div>
        </div>
      </aside>

      <div className="pm-main">
        <header className="pm-topbar">
          <div className="pm-topbar-left">
            <button
              className="pm-icon-btn d-lg-none"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              type="button"
            >
              <i className="bi bi-list" />
            </button>
            <h1 className="pm-title">{pageTitle}</h1>
            <div className="pm-breadcrumb pm-muted d-none d-md-block">
              {location.pathname.replace("/default", "") || "/"}
            </div>
          </div>

          <div className="pm-topbar-right">
            <Link className="pm-pill" to="/default/bot-list">
              <i className="bi bi-grid-1x2" />
              <span className="d-none d-sm-inline">Dashboard</span>
            </Link>
          </div>
        </header>

        <main className="pm-content">
          <div className="pm-content-inner">{children}</div>
        </main>
      </div>

      {open && (
        <div className="pm-backdrop d-lg-none" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}

