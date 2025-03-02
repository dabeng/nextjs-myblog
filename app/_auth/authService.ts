import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { User } from './userModel';
import NextAuth from "next-auth";

/* --- Auth Helper ---
 * The auth helper is used to verify the JWT token in the request 'authorization' cookie.
*/

export const authService = {
  login,
  refresh,
}

/**
 * Log in a user by sending a POST request to the backend using the supplied 
 * credentials.
 *
 * TODO: Implement the actual login functionality by sending a POST request 
 *       to the backend
 *
 * @param username The username of the user
 * @param password The password of the user
 * @returns A BackendJWT response from the backend.
 */
export async function login({ username, password }: { username: string, password: string }) {
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


  return {
    ...user.toJSON(),
    accessToken: jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '5s' }),
    refreshToken: jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '2m' })
  };
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
