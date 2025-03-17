import React, { useEffect } from 'react';
import { redirect } from "next/navigation";

import { authService } from "_helpers/server";
import { Alert, Logo } from "_components";

export default Layout;

async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Logo />
      <Alert />
      <div className="columns hero is-fullheight is-justify-content-center is-align-items-center">
        <div className="column is-4">{children}</div>
      </div>
    </>
  );
}
