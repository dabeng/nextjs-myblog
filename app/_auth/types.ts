export type {AuthTokens};

interface User {
  id: string;
  username: string;
}
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse extends AuthTokens {
  user: User;
}

interface Session extends AuthTokens {
  user: User;
  expires: string;
}

interface JWT extends AuthTokens {
  sub: string;
}

