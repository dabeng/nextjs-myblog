import React, { useEffect } from 'react';
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authService } from "_helpers/server";
import { Alert, Nav } from "_components";
/*
* The secure layout component contains common layout code for all pages in the
* /app/(secure) folder
*/
export default Layout;

async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <Alert />
      <div className="columns is-justify-content-center">
        <div className="column is-6">{children}</div>
      </div>
    </>
  );
}
