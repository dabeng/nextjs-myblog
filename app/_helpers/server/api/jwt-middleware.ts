import { NextRequest } from 'next/server';

import { auth } from '_helpers/server';

export { jwtMiddleware };

/* --- Next.js API JWT Middleware ---
 * The JWT middleware uses the auth helper to verify the JWT token if the request is to a secure API route
 * (public routes are bypassed). If the token is invalid an error is thrown which causes the global error
 *  handler to return a 401 Unauthorized response.
*/

async function jwtMiddleware(req: NextRequest) {
	if (isPublicPath(req))
		return;

	// verify token in request cookie
	const id = auth.verifyToken();
	req.headers.set('userId', id);
}

function isPublicPath(req: NextRequest) {
	// public routes that don't require authentication
	const publicPaths = [
		'POST:/api/account/login',
		'POST:/api/account/logout',
		'POST:/api/account/register'
	];
	return publicPaths.includes(`${req.method}:${req.nextUrl.pathname}`);
}