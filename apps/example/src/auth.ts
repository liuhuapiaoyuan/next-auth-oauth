import { AdavanceNextAuth } from 'next-auth-oauth'

import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db'
import { AuthService } from '@/service/auth.service'
import { Gitee } from '@next-auth-oauth/gitee'
import Github from 'next-auth/providers/github'

import { AuthConfig } from './auth.config'

export const authAdapter = PrismaAdapter(prisma)
export const authService = new AuthService()
export const {
  handlers,
  oauthProviders,
  signIn,
  signUp,
  signOut,
  auth,
  tempOauthUser,
  signInAndBindAccount,
  signUpAndBindAccount,
  listAccount,
} = AdavanceNextAuth({
  ...AuthConfig,
  providers: [Gitee, Github],
  adapter: authAdapter,
  userService: authService,
  autoBind: true,
})
