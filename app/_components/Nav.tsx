"use client";

import { useState } from "react";

import { NavLink } from "_components";
import { logoutAction } from "@/_auth/actions";

export { Nav };

function Nav() {
  const [loggingOut, setLoggingOut] = useState(false);

  async function logoutHandler() {
    setLoggingOut(true);
    await logoutAction();
  }

  return (
    <nav className="navbar is-dark">
      <div className="navbar-brand">
        <a className="navbar-item" href="https://github.com/dabeng" target="_blank">
          <img src="/logo.png" />
        </a>
        <div className="navbar-burger js-burger" data-target="navMenuColordark-example">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start" style={{ "fontSize": "1.125rem" }}>
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
                onClick={logoutHandler}
                className="button"
                disabled={loggingOut}
              >
                {loggingOut ? (
                  <span className="icon">
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                  </span>
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
