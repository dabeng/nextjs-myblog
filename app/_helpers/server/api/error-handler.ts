import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export { errorHandler };

/* --- Next.js API Global Error Handler ---
 * The global error handler is used catch all API errors and remove the need for duplicated error handling code
 * throughout the nextjs-myblog API. 
*/

async function errorHandler(err: Error | string) {
	if (typeof (err) === 'string') {
		// custom application error
		const is404 = err.toLowerCase().endsWith('not found');
		const status = is404 ? 404 : 400;
		return NextResponse.json({ message: err }, { status });
	}

	if (err.name === 'JsonWebTokenError') {
		// jwt error - delete cookie to auto logout
		(await cookies()).delete('authorization');
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	if (err.message === 'Username or password is incorrect') {
		return NextResponse.json({ message: err.message }, { status: 200 });
	}

	// default to 500 server error
	return NextResponse.json({ message: err.message }, { status: 500 });
}