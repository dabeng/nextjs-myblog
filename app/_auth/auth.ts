import axios from "axios";
import { object, string } from "zod";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        // Add logic here to look up the user from the credentials supplied
        // Any object returned will be saved in `user` property of the JWT callback
        try {
          const loginSchema = object({
            username: string(),
            password: string()
          });
          const { username, password } = await loginSchema.parseAsync(credentials);

          return await axios.post('/api/auth/login', { username, password });
        } catch (error) {
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  callbacks: {
    // This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated
    // (i.e whenever a session is accessed in the client). The returned value will be encrypted,
    // and it is stored in a cookie.
    jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        return {
          ...token,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken
        }
      }
      
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          email: user.email,
          name: user.name
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        user: {
          id: token.sub!,
          email: token.email!,
          name: token.name
        }
      }
    }
  }
});