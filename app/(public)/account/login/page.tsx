"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

import { useUserService, useAlertService } from "_services";
// import { signIn } from "@/auth";



import { useSearchParams, useRouter } from "next/navigation";
import type { SignInResponse } from "next-auth/react";
// import { signIn } from "next-auth/react";

import { loginAction } from "@/_auth/actions";
import { useActionState } from 'react';

import { signIn } from "next-auth/react";


export default Login;

function Login() {
  const userService = useUserService();
  const alertService = useAlertService();

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;

  const fields = {
    username: register("username", { required: "Username is required" }),
    password: register("password", { required: "Password is required" })
  };

  async function onSubmit({ username, password }: any) {
    const callbackUrl = searchParams.get("callbackUrl");
    await userService.login(username, password);

  }

  // const credentialsAction = (formData: any) => {
  //   signIn("credentials", formData);
  // }

  const searchParams = useSearchParams();
  const router = useRouter();
  // async function credentialsAction(formData: any) { // whatever your type
  //   const callbackUrl = searchParams.get("callbackUrl")
  //   signIn("credentials", formData)
  //     .then((res: SignInResponse | undefined) => {
  //       if (!res) {
  //         alert("No response!")
  //         return
  //       }

  //       if (!res.ok)
  //         alert("Something went wrong!")
  //       else if (res.error) {
  //         console.log(res.error)

  //         if (res.error == "CallbackRouteError")
  //           alert("Could not login! Please check your credentials.")
  //         else
  //           alert(`Internal Server Error: ${res.error}`)
  //       } else {
  //         if (callbackUrl)
  //           router.push(callbackUrl)
  //         else
  //           router.push("/")
  //       }
  //     })
  // }

  async function submitHandler (e)  {
    e.preventDefault();

    const res = await signIn("credentials", {
      username: e.target.username.value,
      password: e.target.password.value,
      redirect: false,
    });
    console.log(res);
    if (res?.error) {
      alert(res?.error);
    } else {
      alert("sign in sucessful");
      router.push('/');
    }
  };

  // const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    // <form action={formAction}>
    <form onSubmit={submitHandler}>
      {/* {state?.message && <p aria-live="polite">{state.message}</p>} */}
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
