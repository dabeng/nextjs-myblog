import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AddEdit } from "_components/users";
import { Spinner } from "_components";
import { useUserService } from "_services";
/*
The edit user page renders the add/edit user component with the specified user so the component
* is set to "edit" mode.
*/
export default async function Edit({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const router = useRouter();
  const userService = useUserService();
  const user = userService.user;

  useEffect(() => {
    if (!id) return;

    // fetch user for add/edit form
    userService.getById(id);
  }, [router]);

  return user ? <AddEdit title="Edit User" user={user} /> : <Spinner />;
}
