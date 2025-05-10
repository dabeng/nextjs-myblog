import { z } from "zod";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  commentService, errorHandler,
  validateMiddleware
} from "_helpers/server";
import { AuthError } from "next-auth";
import { ICommentOnePageParams } from "@/_services";
/*
 * --- Comments Route Handler---
 * The comments handler receives HTTP requests sent to the base users route /api/comments.
 */
export { GET, POST };

interface SearchParams {
  page: number;
  [property: string]: string | number;
}

async function GET(req: NextRequest) {
  try {
    let comments;
    if (req.nextUrl.searchParams.size) {
      const params: SearchParams = { page: 0 };
      for (const [key, value] of req.nextUrl.searchParams) {
        params[key] = value;
        if (key === 'page' || key === 'page_size') {
          params[key] = parseInt(value);
        }
      }
      comments = await commentService.getBySearchParams(params);
    } else {
      comments = await commentService.getAll();
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
      author: z.string(),
      blog: z.string(),
      content: z.string(),
      parentComment: z.string().optional()
    });
    await validateMiddleware(req, schema);

    const body = await req.json();
    await commentService.create(body);
    return NextResponse.json({});
  } catch (err: any) {
    // global error handler
    return errorHandler(err);
  }
}
