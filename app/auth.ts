import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { object, string } from "zod";
import NextAuth, {CredentialsSignin} from "next-auth";
import type { User } from "next-auth";
import 'next-auth/jwt';
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
 class InvalidCredentialsError extends CredentialsSignin {
  code = "Username or password is incorrect"
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        // Any object returned will be saved in `user` property of the JWT callback
        // FYI, https://authjs.dev/reference/core/providers/credentials#authorize
          const loginSchema = object({
            username: string(),
            password: string()
          });
          const { username, password } = await loginSchema.parseAsync(credentials);

          const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, { username, password });

          if (response.data?.message === 'Username or password is incorrect') {
            return { error: response.data?.message, status: 200, ok: true, url: null }
          }

          return {
            ...response.data,
            accessExp: jwtDecode(response.data.accessToken).exp,
            refreshExp: jwtDecode(response.data.refreshToken).exp,
          } as User;
      },
    }),
  ],
  callbacks: {
    // FYI, https://next-auth.js.org/configuration/callbacks#jwt-callback
    async jwt({ token, user, trigger, session, account }) {
      // Initial signin contains a 'User' object from authorize method
      if (user && account) {
        return {
          ...token,
          user: { id: user.id, username: user.username, role: user.role },
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
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh`, token);
        return {
          ...token,
          accessToken: response.data,
          accessExp: jwtDecode(response.data).exp,
        }
      }

      // The current access token and refresh token have both expired
      // This should not really happen unless you get really unlucky with
      // the timing of the token expiration because the middleware should
      // have caught this case before the callback is called
      return { ...token } as JWT;
    },
    // FYI, https://authjs.dev/reference/nextjs#signin
    async signIn({ user }) {
      if (user?.error) {
        throw new InvalidCredentialsError();
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
    role: string;
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
