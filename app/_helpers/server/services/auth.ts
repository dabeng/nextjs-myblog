import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { User } from '../models';

/* --- Auth Helper ---
 * The auth helper is used to verify the JWT token in the request 'authorization' cookie.
*/

export const auth = {
  isAuthenticated,
  verifyToken,
  authenticate,
}

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
function isAuthenticated() {
  try {
    verifyToken();
    return true;
  } catch {
    return false;
  }
}