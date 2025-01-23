import { cookies } from "next/headers";
import {zod} from "zod";
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server'
import { authService } from "_helpers/server";


/* --- Login Route Handler  ---
* It receives HTTP requests sent to the login route /api/account/login.
* It supports HTTP POST requests containing a username and password which are authenticated by
* the usersRepo.authenticate() function. On success a JWT auth token is set in an HTTP only
* 'authorization' cookie.
*/
export async function POST(req: NextRequest) {
  try {
    await jwtMiddleware(req);
		const schema = z.object({
			username: z.string(),
			password: z.string()
		});
		await validateMiddleware(req, schema);
	
		const body = await req.json();
    const { user, token } = await authService.authenticate(body);

    // return jwt token in http only cookie
    (await cookies()).set("authorization", token, { httpOnly: true });// TODO, access token +refresh token

    return NextResponse.json(user);
  } catch (err: any) {
		// global error handler
		return errorHandler(err);
	}
}

