"use client";

import { useState } from "react";

import { NavLink } from "_components";
import { logoutAction } from "@/_auth/actions";
import { useSession } from "next-auth/react";

export { Nav };

function Nav() {
  const {data: session} = useSession();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logoutHandler() {
    setLoggingOut(true);
    await logoutAction();
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a className="navbar-item" href="https://github.com/dabeng" target="_blank">
          <img src="/logo.png" />
          <p>
            <span className="title is-3 has-text-white">Dabeng's My Blog</span><br/>
          <span className="title is-5 has-text-white">A WEB DEVELOPER IN CHINA</span>
          </p>
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
          {session?.user?.role === 'admin' &&
            <NavLink href="/users" className="navbar-item">
              Users
            </NavLink>
          }
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="field is-grouped">
              <p className="control">
                <NavLink href={`/profile/${session?.user?.id}`} className="button is-dark is-light">
                  {session?.user?.username}
                </NavLink>
              </p>
              <p className="control">
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
                    <span className="icon">
                      <i className="fa-solid fa-right-from-bracket"></i>
                    </span>
                  )}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
