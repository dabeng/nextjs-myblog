import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from "zod";
import {
  errorHandler,
  jwtMiddleware,
  validateMiddleware
} from "_helpers/server";
/* --- Logout Route Handler ---
* It  simply deletes the 'authorization' cookie to log the user out. The cookie is HTTP only which
* means it is only accessible on the server, this improves security by preventing cross site 
* scripting (XSS) where malicious client side code can attempt to access private data like cookies.
*/

export async function POST(req: NextRequest) {
  try {
    await jwtMiddleware(req);

    (await cookies()).delete('authorization');
    return NextResponse.json({});
  } catch (err: any) {
    // global error handler
    return errorHandler(err);
  }

}