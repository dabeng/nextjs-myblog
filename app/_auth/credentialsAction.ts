"use server"

import { signIn } from "@/auth";

export default async function (formData: any) {

    await signIn("credentials", {
        username:formData.get('username'), 
        password: formData.get('password'), 
        redirectTo: '/'
        // callbackUrl: 'http://localhost:3000/',
        // redirect: false,
    });

}