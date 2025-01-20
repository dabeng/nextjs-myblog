import { cookies } from 'next/headers';
/* --- Logout Route Handler ---
* It  simply deletes the 'authorization' cookie to log the user out. The cookie is HTTP only which
* means it is only accessible on the server, this improves security by preventing cross site 
* scripting (XSS) where malicious client side code can attempt to access private data like cookies.
*/

export function POST() {
  try {
    await jwtMiddleware(req);
		const schema = z.object({
			username: z.string(),
			password: z.string()
		});
		await validateMiddleware(req, schema);
		
    (await cookies()).delete('authorization');
    return NextResponse.json({});
  } catch (err: any) {
		// global error handler
		return errorHandler(err);
	}
    
}