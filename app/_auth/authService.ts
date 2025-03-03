import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from './userModel';
import { useSession, signOut } from 'next-auth/react';
import axios from "axios";

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
async function login({ username, password }: { username: string, password: string }) {
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
async function refresh(): Promise<Response> {
  try {
    const { data: session, update } = useSession();
    const response = await axios.post('/auth/refresh', {
      refreshToken: session?.refreshToken
    });

    // Implement refresh token rotation
    if (response.data.newRefreshToken) {
      await update({
        ...session,
        refreshToken: response.data.newRefreshToken
      })
    }

    return response.data.accessToken;
  } catch (error) {
    // Handle token compromise
    await signOut();
    throw new Error('Failed to refresh token');
  }

}
