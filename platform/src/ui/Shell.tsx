import React from "react";
import { Link, NavLink } from "react-router-dom";
import { signOut } from "../lib/auth";
import { useAuthUser, useUserDoc, useSettings } from "../lib/state";
import { PHASE_LABEL } from "../lib/constants";

export function Shell({ children }: { children: React.ReactNode }) {
  const { fbUser } = useAuthUser();
  const { user } = useUserDoc(fbUser?.uid);
  const { settings } = useSettings();

  const isAdmin = user?.role === "admin";

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <Link to="/" aria-label="Home" style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
            <span className="brand-mark" />
            <span className="brand-name">FAB Workshop</span>
          </Link>
          {settings && (
            <span className="tag" title="aktuelle Phase">
              {PHASE_LABEL[settings.currentPhase]}
            </span>
          )}
        </div>
        <nav>
          {fbUser && (
            <>
              <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
                Dashboard
              </NavLink>
              <NavLink to="/submit" className={({ isActive }) => (isActive ? "active" : "")}>
                Submission
              </NavLink>
              <NavLink to="/vote" className={({ isActive }) => (isActive ? "active" : "")}>
                Voting
              </NavLink>
              <NavLink to="/results" className={({ isActive }) => (isActive ? "active" : "")}>
                Results
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
                  Admin
                </NavLink>
              )}
              <button className="btn ghost" onClick={() => signOut()}>
                Sign out
              </button>
            </>
          )}
          {!fbUser && (
            <NavLink to="/auth" className={({ isActive }) => (isActive ? "active" : "")}>
              Sign in
            </NavLink>
          )}
        </nav>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <span>FAB · 2026</span>
        <span>{user ? `${user.fullName} · ${user.role}` : ""}</span>
      </footer>
    </div>
  );
}
