import { z } from "zod";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  userService,
  errorHandler,
  jwtMiddleware,
  validateMiddleware
} from "_helpers/server";
/* --- Users [id] Route Handler ---
 * A dynamic API route handler that handles HTTP requests with any value as the [id] parameter
 * (i.e. /api/users/*). The user id parameter is attached by Next.js to the params object which
 * is passed to the route handler.
 */
export { GET, PUT, DELETE };

async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await jwtMiddleware(req);
    const user = await userService.getById((await params).id);
    return NextResponse.json(user);
  } catch (err: any) {
    // global error handler
    return errorHandler(err);
  }
}

async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await jwtMiddleware(req);
    const schema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      username: z.string(),
      password: z.union([z.string().min(6), z.literal("")])
    });
    await validateMiddleware(req, schema);

    const body = await req.json();
    await userService.update((await params).id, body);
    return NextResponse.json({});
  } catch (err: any) {
    // global error handler
    return errorHandler(err);
  }
}

async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await jwtMiddleware(req);

    await userService.delete((await params).id);
    // auto logout if deleted self
    if ((await params).id === req.headers.get("userId")) {
      (await cookies()).delete('authorization');
      return NextResponse.json({ deletedSelf: true });
    } else {
      return NextResponse.json({});
    }
  } catch (err: any) {
    // global error handler
    return errorHandler(err);
  }
}
