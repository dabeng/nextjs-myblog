import { z } from "zod";

export { validateMiddleware };

/* --- Next.js API Validate Middleware ---
 * The validate middleware uses the Joi library to validate JSON data in the request body against
 * rules defined in a schema. If validation fails an error is thrown with a comma separated list of
 *  all the error messages
*/

async function validateMiddleware<T extends z.ZodTypeAny>(req: Request, schema: T) {
	if (!schema) return;

	const body = await req.json();
	const result = schema.safeParse(body);

	if (!result.success) {
		/* error.issues
		[
	        {
	        	"code": "invalid_type",
	        	"expected": "string",
	        	"received": "number",
	        	"path": [ "name" ],
	        	"message": "Expected string, received number"
	        }
    ] */
		throw `Validation error: ${result.error.issues.map(x => x.message + ' at "' + x.path + '"').join(', ')}`;
	}

	// update req.json() to return sanitized req body
	req.json = () => result.data;
}