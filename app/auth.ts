import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { object, string } from "zod";
import NextAuth, {CredentialsSignin} from "next-auth";
import type { User } from "next-auth";
import 'next-auth/jwt';
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import {
  authService,
} from "@/_auth/authService";
import jwt from 'jsonwebtoken';

class CustomError extends CredentialsSignin {
  code = "custom_error"
 }

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        // Any object returned will be saved in `user` property of the JWT callback
        // FYI, https://authjs.dev/reference/core/providers/credentials#authorize
        try {
          const loginSchema = object({
            username: string(),
            password: string()
          });
          const { username, password } = await loginSchema.parseAsync(credentials);

          const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, { username, password });

          if (response.data?.errorMessage) {
            // throw new Error("Invalid credentials.")
            // return { error: response.data?.errorMessage };
            // throw new CustomError();
            return {error: 'custom error message', status: 200, ok: true, url: null}
          }

          return {
            ...response.data,
            accessExp: jwtDecode(response.data.accessToken).exp,
            refreshExp: jwtDecode(response.data.refreshToken).exp,
          } as User;
        } catch (err: any) {
          return null;
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
    async jwt({ token, user, trigger, session, account }) {
      // Initial signin contains a 'User' object from authorize method
      if (user && account) {
        return {
          ...token,
          user: { id: user.id, username: user.username },
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessExp: user.accessExp,
          refreshExp: user.refreshExp,
        };
      }

      // The current access token is still valid
      if (Date.now() < token.accessExp * 1000) {
        return token;
      }

      // The refresh token is still valid
      if (Date.now() < token.refreshExp * 1000) {
        return await axios.post('/auth/refresh', token);
      }

      // The current access token and refresh token have both expired
      // This should not really happen unless you get really unlucky with
      // the timing of the token expiration because the middleware should
      // have caught this case before the callback is called
      return { ...token } as JWT;
    },
    async signIn({ user }) {
      if (user?.error) {
        throw new Error(user?.error )
      }
      return true;
    },
    // FYI, https://next-auth.js.org/configuration/callbacks#session-callback
    async session({ session, token }) {
      return {
        ...session,
        user: token.user,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        accessExp: token.accessExp,
        refreshExp: token.refreshExp,
      }
    }
  }
});

declare module "next-auth" {
  interface User {
    username: string;
    accessToken: string;
    refreshToken: string;
    accessExp: number;
    refreshExp: number;
  }
}

declare module 'next-auth' {
  interface Session {
    user: User;
    accessToken?: string;
    refreshToken?: string;
    accessExp: number;
    refreshExp: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessExp: number;
    refreshExp: number;
  }
}
