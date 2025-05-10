import { z } from "zod";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  voteService, errorHandler,
  validateMiddleware
} from "_helpers/server";


/*
 * --- Votes Route Handler---
 * The votes handler receives HTTP requests sent to the base users route /api/votes.
 */
export { GET, POST };

async function GET(req: NextRequest) {
  try {
    let comments;
    if (req.nextUrl.searchParams) {
      comments = await voteService.getBySearchParams(req.nextUrl.searchParams);
    } else {
      comments = await voteService.getAll();
    }
    return NextResponse.json(comments);
  } catch (err: any) {
    // global error handler
    return errorHandler(err);
  }
}

async function POST(req: NextRequest) {
  try {
    const schema = z.object({
      user: z.string(),
      comment: z.string(),
      vote: z.string()
    });
    await validateMiddleware(req, schema);

    const body = await req.json();
    await voteService.create(body);
    return NextResponse.json({});
  } catch (err: any) {
    // global error handler
    return errorHandler(err);
  }
}
