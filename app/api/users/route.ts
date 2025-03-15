import { z } from "zod";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { userService,  errorHandler,
  jwtMiddleware,
  validateMiddleware } from "_helpers/server";
/*
 * --- Users Route Handler---
 * The users handler receives HTTP requests sent to the base users route /api/users.
 */
export { GET, POST };

async function GET(req: NextRequest) {
  try {
    const users = await userService.getAll();
    return NextResponse.json(users);
  } catch (err: any) {
    // global error handler
    return errorHandler(err);
  }
}

async function POST(req: NextRequest) {
  try {
    const schema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      username: z.string(),
      password: z.string().min(6)
    });
    await validateMiddleware(req, schema);

    const body = await req.json();
    await userService.create(body);
    return NextResponse.json({});
  } catch (err: any) {
    // global error handler
    return errorHandler(err);
  }
}
