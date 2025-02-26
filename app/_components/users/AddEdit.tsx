"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAlertService, useUserService } from "_services";
import type { IUser } from "_services";
/*
 * The users AddEdit component is used for both adding and editing users, it contains a form
 * built with the React Hook Form library and is used by the add user page and edit user page.
 */
export { AddEdit };

function AddEdit({ title, user }: { title: string; user?: any }) {
  const router = useRouter();
  const alertService = useAlertService();
  const userService = useUserService();

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: user
  });
  const { errors } = formState;

  const fields = {
    firstName: register("firstName", { required: "First Name is required" }),
    lastName: register("lastName", { required: "Last Name is required" }),
    username: register("username", { required: "Username is required" }),
    password: register("password", {
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters"
      },
      // password only required in add mode
      validate: value => (!user && !value ? "Password is required" : undefined)
    })
  };

  const queryClient = useQueryClient();
  const updateUserMutation = useMutation({
    mutationFn: (data: IUser) => {
      return userService.update(user.id, data);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['users', 'detail', user.id]
      });
    },
  });

  const createUserMutation = useMutation({
    mutationFn: (data: IUser) => {
      return userService.create(data);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['users', 'list']
      });
    },
  });

  async function onSubmit(data: any) {
    try {
      alertService.clear();
      // create or update user based on user prop
      let message;
      if (user) {
        await updateUserMutation.mutateAsync(data);
        message = "User updated";
      } else {
        await createUserMutation.mutateAsync(data);
        message = "User added";
      }
      // redirect to user list with success message
      router.push("/users");
      alertService.success(message, true);
    } catch (error: any) {
      alertService.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="title mt-5">{title}</h1>
      <div className="field">
        <label className="label">First Name</label>
        <div className="control">
          <input
            {...fields.firstName}
            type="text"
            className={`input ${errors.firstName ? "is-danger" : ""}`}
          />
        </div>
        <p className="help is-danger">{errors.firstName?.message?.toString()}</p>
      </div>
      <div className="field">
        <label className="label">Last Name</label>
        <div className="control">
          <input
            {...fields.lastName}
            type="text"
            className={`input ${errors.lastName ? "is-danger" : ""}`}
          />
        </div>
        <p className="help is-danger">{errors.lastName?.message?.toString()}</p>
      </div>
      <div className="field">
        <label className="label">Username</label>
        <div className="control">
          <input
            {...fields.username}
            type="text"
            className={`input ${errors.username ? "is-danger" : ""}`}
          />
        </div>
        <p className="help is-danger">{errors.username?.message?.toString()}</p>
      </div>
      <div className="field">
        <label className="label">
          Password
          {user && (
            <em className="help is-success">
              (Leave blank to keep the same password)
            </em>
          )}
        </label>
        <div className="control">
          <input
            {...fields.password}
            type="password"
            className={`input ${errors.password ? "is-danger" : ""}`}
          />
        </div>
        <div className="help is-danger">
          {errors.password?.message?.toString()}
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="button is-dark"
          >
            Save
            {formState.isSubmitting && (
              <span className="icon ml-0">
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              </span>
            )}
          </button>
        </div>
        <div className="control">
          <button
            onClick={() => reset()}
            type="button"
            disabled={formState.isSubmitting}
            className="button"
          >
            Reset
          </button>
        </div>
        <div className="control">
          <Link href="/users" className="button">
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
