import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { publicRoutes } from "@/_auth/contants";

export default auth((req) => {
  // if (!req.auth && req.nextUrl.pathname !== "/account/login") {
  //   const newUrl = new URL("/account/login", req.nextUrl.origin)
  //   return Response.redirect(newUrl)
  // }

  // Check if the user is authenticated
  if ((!req.auth && !publicRoutes.some((route) => route === req.nextUrl.pathname))
    || (req.auth && Date.now() >= req.auth.refreshExp * 1000)) {
    // Redirect to the login page
    return NextResponse.redirect(new URL("/account/login", req.nextUrl.origin));
  }

  // If authenticated, continue with the request
  return NextResponse.next();
});

// Authenticate all routes except for /api, /_next/static, /_next/image, and .png files
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|account/login).*)"],
};