"use server"

import { signIn } from "@/auth";
import { useRouter } from "next/navigation";

export default async function (formData: any) {

    await signIn("credentials", {username:formData.get('username'), password: formData.get('password'), redirectTo: '/'});

}