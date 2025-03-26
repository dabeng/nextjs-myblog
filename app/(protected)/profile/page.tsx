
"use client"

import { useSession } from "next-auth/react";
import { Spinner } from "_components";
/*
 * The home page is a simple React component that displays a welcome message with the
 * logged in user's name and a link to the users section.
 */
export default Profile;

function Profile() {
  const {data: session} = useSession();

  if (session?.user) {
    return (
      <>
        <h1>Hi {session.user.username}!</h1>
        <p>You&apos;re logged in with Next.js & JWT!!</p>
      </>
    );
  } else {
    return <div style={{"height": "600px", "fontSize": "64px"}}><Spinner /></div>
  }
}
