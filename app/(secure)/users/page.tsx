"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Spinner } from "_components";
import { useAlertService, useUserService } from "_services";
import type { IUser } from "_services";
/*
 * The users list page displays a list of all users in the Next.js tutorial app and
 * contains buttons for adding, editing and deleting users.
 */
export default Users;

function Users() {
  const [ deletedUserId, setDeletedUserId ] = useState('');
  const alertService = useAlertService();
  const userService = useUserService();

  const { data: users, error, isPending, isSuccess } = useQuery({
    queryKey: ["users", 'list'],
    queryFn: () => userService.getAll()
  });

  const queryClient = useQueryClient();
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => {
      return userService.delete(id);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['users', 'list']
      });
    },
  });

  async function deleteUser(id: string) {
    try {
      setDeletedUserId(id);
      alertService.clear();
      await deleteUserMutation.mutateAsync(id);
      alertService.success(`User(${id}) has been deleted`, true);
    } catch (error: any) {
      alertService.error(error);
    }
  }

  return (
    <>
      <h1 className="title mt-5">Users</h1>
      <Link href="/users/add" className="button is-dark">
        Add User
      </Link>
      <table className="table table-striped" style={{ "width": "100%" }}>
        <thead>
          <tr>
            <th style={{ width: "25%" }}>First Name</th>
            <th style={{ width: "25%" }}>Last Name</th>
            <th style={{ width: "25%" }}>Username</th>
            <th style={{ width: "25%" }}></th>
          </tr>
        </thead>
        <tbody>
          <TableBody />
        </tbody>
      </table>
    </>
  );

  function TableBody() {
    if (isPending) {
      return (
        <tr>
          <td colSpan={4} style={{ "height": "80px", "fontSize": "64px" }}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={4} className="text-center">
            <div className="p-2">No Users To Display</div>
          </td>
        </tr>
      );
    }

    if ((users as Array<IUser>).length === 0) {
      return (
        <tr>
          <td colSpan={4} className="text-center">
            <div className="p-2">No Users To Display</div>
          </td>
        </tr>
      );
    }

    return users?.map(user => (
      <tr key={user.id}>
        <td>{user.firstName}</td>
        <td>{user.lastName}</td>
        <td>{user.username}</td>
        <td style={{ whiteSpace: "nowrap" }}>
          <div className="buttons">
            <Link
              href={`/users/edit/${user.id}`}
              className="button is-dark is-small"
            >
              Edit
            </Link>
            <button
              onClick={() => deleteUser(user.id)}
              className="button is-small"
              style={{ width: "60px" }}
              disabled={deletedUserId === user.id && deleteUserMutation.isPending}
            >
                <span>Delete</span>
              {deletedUserId === user.id && deleteUserMutation.isPending && (
              <span className="icon ml-0">
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              </span>
              )}
            </button>
          </div>
        </td>
      </tr>
    ));
  }
}
