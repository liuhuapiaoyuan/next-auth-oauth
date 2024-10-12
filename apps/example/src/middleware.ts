import NextAuth from 'next-auth'
import { AuthConfig } from './lib/auth/config'

export const { auth: middleware } = NextAuth(AuthConfig)
