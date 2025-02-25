"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { AddEdit } from "_components/users";
import { Spinner } from "_components";
import { useUserService, IUser } from "_services";
/*
The edit user page renders the add/edit user component with the specified user so the component
* is set to "edit" mode.
*/
export default function Edit() {
  const { id } = useParams<{ id: string }>();
  const userService = useUserService();

  const { data, error, isLoading } = useQuery({
    queryKey: ["users", 'detail', id],
    queryFn: () => userService.getById(id)
  });


  if (isLoading) return <div style={{ "height": "600px", "fontSize": "64px" }}><Spinner /></div>;
  if (error) return <p>Error loading user: {error.message}</p>;

  return <AddEdit title="Edit User" user={data} />;

}
