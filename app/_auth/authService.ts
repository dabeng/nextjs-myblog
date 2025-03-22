import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from './userModel';
import { useSession, signOut } from 'next-auth/react';
import { errorHandler } from '@/_helpers/server';

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
    accessToken: jwt.sign({ sub: user.id }, process.env.AUTH_SECRET!, { expiresIn: '10s' }),
    refreshToken: jwt.sign({ sub: user.id }, process.env.AUTH_SECRET!, { expiresIn: '1m' })
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
async function refresh(refreshToken:string): Promise<string> {
  try {
    const { data: session, update } = useSession();

    // Verify that the token is valid and not expired
      const decoded = jwt.verify(refreshToken, process.env.AUTH_SECRET!);
      const id = decoded.sub as string;


    // Implement refresh token rotation
    // if (response.data.newRefreshToken) {
    //   await update({
    //     ...session,
    //     refreshToken: response.data.newRefreshToken
    //   })
    // }

    return jwt.sign({ sub: id }, process.env.AUTH_SECRET!, { expiresIn: '10s' });
  } catch (error) {
    // Handle token compromise
    // await signOut();
    throw errorHandler(new Error('Failed to refresh token'));
  }

}
