import React, { useEffect } from 'react';
import { redirect } from "next/navigation";

import { authService } from "_helpers/server";
import { Alert } from "_components";

export default Layout;

async function Layout({ children }: { children: React.ReactNode }) {
  // if logged in redirect to home page
  if (await authService.isAuthenticated()) {
    // redirect("/");
  }

  return (
    <>
      <Alert />
      <div className="columns hero is-fullheight is-justify-content-center is-align-items-center">
        <div className="column is-4">{children}</div>
      </div>
    </>
  );
}
