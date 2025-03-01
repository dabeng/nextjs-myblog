"use client";

import Link from "next/link";
import { useEffect } from "react";

import { useUserService } from "_services";
import { Spinner } from "_components";
/*
 * The home page is a simple React component that displays a welcome message with the
 * logged in user's name and a link to the users section.
 */
export default Home;

function Home() {
  const userService = useUserService();
  const user = userService.currentUser;

  useEffect(() => {
    userService.getCurrent();
  }, []);

  if (user) {
    return (
      <>
        <h1>Hi {user.firstName}!</h1>
        <p>You&apos;re logged in with Next.js & JWT!!</p>
        <p>
          <Link href="/users">Manage Users</Link>
        </p>
      </>
    );
  } else {
    return <div style={{"height": "600px", "fontSize": "64px"}}><Spinner /></div>
  }
}
