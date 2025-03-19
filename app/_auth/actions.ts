"use server"

import { signIn, signOut } from "@/auth";
// import { redirect } from "next/navigation";
import type { SignInResponse } from "next-auth/react";

export { loginAction, logoutAction };
// Avoid using try/catch blocks for expected errors. 
// Instead, you can model expected errors as return values, not as thrown exceptions.
async function loginAction (prevState: any, formData: FormData) {

  const res = await signIn("credentials", {
      username: formData.get('username'),
      password: formData.get('password'),
      redirectTo: '/'
    })
  if (res===null) {
    return {message: 'fail'}
  }
  return {message: 'success'}
}

async function logoutAction () {
  await signOut();
};