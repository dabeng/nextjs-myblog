import { z } from "zod";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { blogService,  errorHandler,
  validateMiddleware } from "_helpers/server";
import { AuthError } from "next-auth";
/*
 * --- Users Route Handler---
 * The users handler receives HTTP requests sent to the base users route /api/users.
 */
export { GET, POST };

async function GET(req: NextRequest) {
  try {
    const blogs = await blogService.getAll();
    return NextResponse.json(blogs);
  } catch (err: any) {
    // global error handler
    return errorHandler(err);
  }
}

async function POST(req: NextRequest) {
  try {
    const schema = z.object({
      title: z.string(),
      subtitle: z.string(),
      content: z.string(),
      author: z.string() // user.id
    });
    await validateMiddleware(req, schema);

    const body = await req.json();
    await blogService.create(body);
    return NextResponse.json({});
  } catch (err: any) {
    // global error handler
    return errorHandler(err);
  }
}
