import {z} from 'zod';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers';
import { userService } from '_helpers/server';
/* --- Users [id] Route Handler ---
* A dynamic API route handler that handles HTTP requests with any value as the [id] parameter
* (i.e. /api/users/*). The user id parameter is attached by Next.js to the params object which
* is passed to the route handler.
*/
export {GET, PUT, DELETE};

async function GET(req: NextRequest, { params: Promise<{ id: string }> }) {
  try {
		await jwtMiddleware(req);
    const user = await userService.getById(id);
    return NextResponse.json(user);
  } catch (err: any) {
		// global error handler
		return errorHandler(err);
	}
}

async function PUT(req: NextRequest, { params: Promise<{ id: string }> }) {
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
    await userService.update(id, body);
    return NextResponse.json({});
  } catch (err: any) {
		// global error handler
		return errorHandler(err);
	}
}

async function DELETE(req: NextRequest, { params: Promise<{ id: string }> }) {
  try {
		await jwtMiddleware(req);

    await userService.delete(id);
    // auto logout if deleted self
    if (id === req.headers.get('userId')) {
        cookies().delete('authorization');
        return NextResponse.json({ deletedSelf: true });
    }
  } catch (err: any) {
		// global error handler
		return errorHandler(err);
	}
}