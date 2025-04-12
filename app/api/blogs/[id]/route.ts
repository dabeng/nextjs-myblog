import { z } from "zod";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  blogService,
  errorHandler,
  validateMiddleware
} from "_helpers/server";
/* --- Blogs [id] Route Handler ---
 * A dynamic API route handler that handles HTTP requests with any value as the [id] parameter
 * (i.e. /api/blogs/*). The user id parameter is attached by Next.js to the params object which
 * is passed to the route handler.
 */
export { GET, PUT, DELETE };

async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await blogService.getById((await params).id);
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
    const schema = z.object({
      title: z.string(),
      content: z.string(),
    });
    await validateMiddleware(req, schema);

    const body = await req.json();
    await blogService.update((await params).id, body);
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
    await blogService.delete((await params).id);
    return NextResponse.json({});
  } catch (err: any) {
    // global error handler
    return errorHandler(err);
  }
}
