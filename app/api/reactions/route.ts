import { z } from "zod";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  reactionService, errorHandler,
  validateMiddleware
} from "_helpers/server";

/*
 * --- Users Route Handler---
 * The users handler receives HTTP requests sent to the base users route /api/users.
 */
export { GET, POST };

interface SearchParams {
  [property: string]: string | number;
}

async function GET(req: NextRequest) {
  try {
    let reactions;
    if (req.nextUrl.searchParams.size) {
      const params: SearchParams = {};
      for (const [key, value] of req.nextUrl.searchParams) {
        params[key] = value;
      }
      reactions = await reactionService.getAllBySearchParams(params);
    } else {
      reactions = await reactionService.getAll();
    }
    return NextResponse.json(reactions);
  } catch (err: any) {
    // global error handler
    return errorHandler(err);
  }
}

async function POST(req: NextRequest) {
  try {
    const schema = z.object({
      title: z.string(),
      content: z.string(),
      author: z.string() // user.id
    });
    await validateMiddleware(req, schema);

    const body = await req.json();
    await reactionService.create(body);
    return NextResponse.json({});
  } catch (err: any) {
    // global error handler
    return errorHandler(err);
  }
}
