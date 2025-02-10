import { redirect } from "next/navigation";

import { authService } from "_helpers/server";
import { Alert } from "_components";

export default Layout;

function Layout({ children }: { children: React.ReactNode }) {
  // if logged in redirect to home page
  if (authService.isAuthenticated()) {
    redirect("/");
  }

  return (
    <div className="columns">
      <Alert />
      <div className="column is-6 is-offset-3">{children}</div>
    </div>
  );
}
