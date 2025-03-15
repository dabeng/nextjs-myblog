"use server"

import { signIn, signOut } from "@/auth";

export { loginAction, logoutAction };

async function loginAction (formData: any) {
  await signIn("credentials", {
    username: formData.get('username'),
    password: formData.get('password'),
    redirectTo: '/'
  });
}

async function logoutAction () {
  await signOut();
};