"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

import { useUserService } from "_services";

export default Login;

function Login() {
  const userService = useUserService();

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;

  const fields = {
    username: register("username", { required: "Username is required" }),
    password: register("password", { required: "Password is required" })
  };

  async function onSubmit({ username, password }: any) {
    await userService.login(username, password);
  }

  return (
    <form className="box" onSubmit={handleSubmit(onSubmit)}>
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
        <label className="label">Password</label>
        <div className="control">
          <input
            {...fields.password}
            type="password"
            className={`input ${errors.password ? "is-invalid" : ""}`}
          />
        </div>
        <p className="help is-danger">{errors.password?.message?.toString()}</p>
      </div>
      <div className="field is-grouped">
        <div className="control">
          <button disabled={formState.isSubmitting} className="button is-link">
            {formState.isSubmitting && (
              <span className="icon">
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              </span>
            )}
            Login
          </button>
        </div>
        <div className="control">
          <Link href="/account/register" className="button is-link is-light">
            Register
          </Link>
        </div>
      </div>
    </form>
  );
}
