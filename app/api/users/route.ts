import { z } from "zod";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { userService } from "_helpers/server";
/*
 * --- Users Route Handler---
 * The users handler receives HTTP requests sent to the base users route /api/users.
 */
export { GET, POST };

async function GET() {
  try {
    await jwtMiddleware(req);

    const users = await userService.getAll();
    return NextResponse.json(users);
  } catch (err: any) {
    // global error handler
    return errorHandler(err);
  }
}

async function POST(req: NextRequest) {
  try {
    await jwtMiddleware(req);
    const schema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      username: z.string(),
      password: z.string().min(6)
    });
    await validateMiddleware(req, schema);

    const body = await req.json();
    await usersRepo.create(body);
  } catch (err: any) {
    // global error handler
    return errorHandler(err);
  }
}
