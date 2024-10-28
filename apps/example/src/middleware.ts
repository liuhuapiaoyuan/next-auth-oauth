import NextAuth from 'next-auth'
import { AuthConfig } from './auth.config'

export const { auth: middleware } = NextAuth(AuthConfig)
