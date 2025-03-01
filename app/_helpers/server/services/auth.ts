import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { User } from '../models';

/* --- Auth Helper ---
 * The auth helper is used to verify the JWT token in the request 'authorization' cookie.
*/

export const authService = {
  isAuthenticated,
  verifyToken,
  authenticate,
}

/*
 * The authenticate method verifies the provided username and password. On success a JWT (JSON Web Token)
 * is generated with the jsonwebtoken npm package, the token is digitally signed using a secret key (JWT_SECRET)
 *  so it can't be tampered with, the jwt secret is defined in the .env file.
*/
async function authenticate({ username, password }: { username: string, password: string }) {
  const user = await User.findOne({ username });

  if (!(user && bcrypt.compareSync(password, user.hash))) {
    throw 'Username or password is incorrect';
  }

  // create a jwt token that is valid for 7 days
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  return {
    user: user.toJSON(),
    token
  };
}

/*
* The verifyToken function verifies the JWT auth token using the jsonwebtoken library. In the
* example it is called from the JWT middleware. On success the decoded user id from the auth token
*  is returned. On fail an exception ('JsonWebTokenError') is thrown by the jwt.verify() method.
*/
async function verifyToken() {
  const token = (await cookies()).get('authorization')?.value ?? '';
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  const id = decoded.sub as string;
  return id;
}

/*
* The isAuthenticated function is a simple wrapper that executes verifyToken() in a try/catch block to
* return the current authentication status as a boolean (true or false). It is used in the secure layout
*  and account layout components.
*/
async function isAuthenticated() {
  try {
    await verifyToken();
    return true;
  } catch {
    return false;
  }
}




/**
 * Log in a user by sending a POST request to the backend using the supplied 
 * credentials.
 *
 * TODO: Implement the actual login functionality by sending a POST request 
 *       to the backend
 *
 * @param email The email of the user
 * @param password The password of the user
 * @returns A BackendJWT response from the backend.
 */
export async function login(username: string, password: string): Promise<Response> {
  console.debug("Logging in");

  if (!username) {
    throw new Error("Email is required");
  }
  if (!password) {
    throw new Error("Password is required");
  }

  const user = await User.findOne({ username });

  if (!(user && bcrypt.compareSync(password, user.hash))) {
    throw new Error('Username or password is incorrect');
  }
  
    return new Response(JSON.stringify({
      access: jwt.sign({ ...user }, process.env.JWT_SECRET!, { expiresIn: '5s' }),
      refresh: jwt.sign({ ...user }, process.env.JWT_SECRET!, { expiresIn: '2m' })
    }), {
      status: 200,
      statusText: "OK",
      headers: {
        "Content-type": "application/json"
      }
    });
}

/**
 * Refresh the access token by sending a POST request to the backend using 
 * the supplied refresh token.
 *
 * TODO: Implement the actual refresh functionality by sending a POST 
 *       request to the backend
 *
 * @param token The current refresh token
 * @returns A BackendAccessJWT response from the backend.
 */
export async function refresh(token: string): Promise<Response> {
  if (!token) {
    throw new Error("Token is required");
  }
  // Verify that the token is valid and not expired
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    throw new Error("Refresh token expired");
  }

  return new Response(JSON.stringify({
    access: jwt.sign({ ...user }, process.env.JWT_SECRET!, { expiresIn: '5s' }),
  }), {
    status: 200,
    statusText: "OK",
    headers: {
      "Content-type": "application/json"
    }
  });
}