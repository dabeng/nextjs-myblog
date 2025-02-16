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
    <nav className="navbar is-dark">
      <div className="navbar-brand">
        <a className="navbar-item" href="https://github.com/dabeng" target="_blank">
          <img src="https://dabeng.github.io/OrgChart/img/logo.png" />
        </a>
        <div className="navbar-burger js-burger" data-target="navMenuColordark-example">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start" style={{"fontSize": "1.125rem"}}>
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
                className="button is-dark is-soft"
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
    </nav>
  );
}
