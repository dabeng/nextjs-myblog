import axios from "axios";
import { object, string } from "zod";
import NextAuth from "next-auth";
import 'next-auth/jwt';
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
        // Any object returned will be saved in `user` property of the JWT callback
        // FYI, https://authjs.dev/reference/core/providers/credentials#authorize
        try {
          const loginSchema = object({
            username: string(),
            password: string()
          });
          const { username, password } = await loginSchema.parseAsync(credentials);

          const response = await axios.post('/api/auth/login', { username, password });
          return response.data;
        } catch (error) {
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  session: {
    // FYI, https://authjs.dev/concepts/session-strategies
    strategy: 'jwt',
    // How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  callbacks: {
    // FYI, https://next-auth.js.org/configuration/callbacks#jwt-callback
    async jwt({ token, user, trigger, session }) {
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
        }
      }
      return token;
    },
    // FYI, https://next-auth.js.org/configuration/callbacks#session-callback
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      }
    }
  }
});

declare module "next-auth" {
  interface User {
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    refreshToken?: string
  }
}
 