import { z } from "zod";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { blogService,  errorHandler,
  validateMiddleware } from "_helpers/server";
import { AuthError } from "next-auth";
import { IBlogOnePageParams } from "@/_services";
/*
 * --- Users Route Handler---
 * The users handler receives HTTP requests sent to the base users route /api/users.
 */
export { GET, POST };

interface SearchParams {
  page: number;
  [property: string]: string | number;
}

async function GET(req: NextRequest) {
  try {
    let blogs;
    if (req.nextUrl.searchParams.size) {
      const params:SearchParams = { page:0 };
      for (const [key, value] of req.nextUrl.searchParams) {
        params[key] = value;
        if (key === 'page' || key === 'page_size') {
          params[key] = parseInt(value);
        }
      }
      blogs = await blogService.getBySearchParams(params);
    } else {
      blogs = await blogService.getAll();
    }
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
