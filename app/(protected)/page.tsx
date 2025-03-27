

import Link from "next/link";
// import { useEffect } from "react";

// import { useUserService } from "_services";
import { Spinner } from "_components";
import { auth } from "@/auth";
/*
 * The home page is a simple React component that displays a welcome message with the
 * logged in user's name and a link to the users section.
 */
export default Home;

async function Home() {
  const session = await auth();


  if (session?.user) {
    return (
      <>
        <h1>Hi {session.user.username}!</h1>
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
