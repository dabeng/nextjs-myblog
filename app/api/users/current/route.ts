import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { userService } from "_helpers/server";

/* ---  Current User Route Handler---
 * It receives HTTP requests sent to the current user route /api/users/current
 */

export async function GET() {
  try {
    await jwtMiddleware(req);

    const user = await userService.getCurrent();
    return NextResponse.json(user);
  } catch (err: any) {
    // global error handler
    return errorHandler(err);
  }
}
