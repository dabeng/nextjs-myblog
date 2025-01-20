import { z } from "zod";

import { NextRequest, NextResponse } from "next/server";
import { userService } from "_helpers/server";
import {
	errorHandler,
	jwtMiddleware,
	validateMiddleware
} from "_helpers/server/api";
/* --- Register Route Handler ---
* It receives HTTP requests sent to the register route /api/account/register. It supports HTTP
* POST requests containing user details which are registered in the Next.js tutorial app by the
* usersRepo.create() method.
*/
export async function POST(req: NextRequest) {
	try {
		// global middleware
		await jwtMiddleware(req);
		const schema = z.object({
			firstName: z.string(),
			lastName: z.string(),
			username: z.string(),
			password: z.string().min(6)
		});
		await validateMiddleware(req, schema);

		// route handler
		const body = await req.json();
		await userService.create(body);
		return NextResponse.json({});
	} catch (err: any) {
		// global error handler
		return errorHandler(err);
	}
}