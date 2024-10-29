import { NextAuthConfig } from 'next-auth-oauth'

export const AuthConfig = {
  providers: [],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
  },
} satisfies NextAuthConfig
