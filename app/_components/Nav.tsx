"use client";

import { useState } from "react";

import { NavLink } from "_components";
import { useUserService } from "_services";

export { Nav };

function Nav() {
  const [loggingOut, setLoggingOut] = useState<boolean>(false);
  const userService = useUserService();

  async function logout() {
    setLoggingOut(true);
    await userService.logout();
  }

  return (
    <div className="navbar-menu">
      <div className="navbar-start">
        <NavLink href="/" exact className="navbar-item">
          Home
        </NavLink>
        <NavLink href="/users" className="navbar-item">
          Users
        </NavLink>
      </div>

      <div className="navbar-end">
        <div className="navbar-item">
          <div className="buttons">
            <button
              onClick={logout}
              className="button is-primary"
              disabled={loggingOut}
            >
              {loggingOut ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                <span>Log out</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
