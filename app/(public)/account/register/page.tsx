"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

import { useUserService } from "_services";

export default Register;

function Register() {
  const userService = useUserService();

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;

  const fields = {
    firstName: register("firstName", { required: "First Name is required" }),
    lastName: register("lastName", { required: "Last Name is required" }),
    username: register("username", { required: "Username is required" }),
    password: register("password", {
      required: "Password is required",
      minLength: { value: 6, message: "Password must be at least 6 characters" }
    })
  };

  async function onSubmit(user: any) {
    await userService.register(user);
  }

  return (
    <form className="box" onSubmit={handleSubmit(onSubmit)}>
      <h4 className="title is-4">Register a new user</h4>
      <div className="field">
        <label className="label">First Name</label>
        <div className="control">
          <input
            {...fields.firstName}
            type="text"
            className={`input ${errors.firstName ? "is-danger" : ""}`}
          />
        </div>
        <div className="help is-danger">
          {errors.firstName?.message?.toString()}
        </div>
      </div>
      <div className="field">
        <label className="label">Last Name</label>
        <div className="control">
          <input
            {...fields.lastName}
            type="text"
            className={`input ${errors.lastName ? "is-invalid" : ""}`}
          />
        </div>
        <div className="help is-danger">
          {errors.lastName?.message?.toString()}
        </div>
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
        <div className="help is-danger">
          {errors.username?.message?.toString()}
        </div>
      </div>
      <div className="field">
        <label className="label">Password</label>
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
            disabled={formState.isSubmitting}
            className="button is-primary"
          >
            {formState.isSubmitting && (
              <span className="icon">
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              </span>
            )}
            Register
          </button>
        </div>
        <div className="control">
          <Link href="/account/login" className="button is-link">
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
