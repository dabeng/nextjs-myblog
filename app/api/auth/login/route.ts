import { cookies } from "next/headers";
import { z } from "zod";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  authService,
} from "@/_auth/authService";
import {
    errorHandler,
  } from "_helpers/server";

/* --- Login Route Handler  ---
 * It receives HTTP requests sent to the login route /api/auth/login.
 * It supports HTTP POST requests containing a username and password which are authenticated by
 * the usersRepo.authenticate() function. On success a JWT auth token is set in an HTTP only
 * 'authorization' cookie.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await authService.login(body);

    return NextResponse.json(user);
  } catch (err: any) {
    // global error handler
    return errorHandler(err);
  }
}
