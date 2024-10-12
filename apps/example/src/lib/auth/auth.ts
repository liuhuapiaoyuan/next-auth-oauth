import { AdavanceNextAuth } from 'next-auth-oauth'

import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db'
import { AuthService } from '@/service/auth.service'
import GitHub from 'next-auth/providers/github'

import { AuthConfig } from './config'

export const authAdapter = PrismaAdapter(prisma)

export const { handlers, signIn, signOut, auth, listAccount } =
  AdavanceNextAuth({
    ...AuthConfig,
    providers: [GitHub],
    adapter: authAdapter,
    userService: new AuthService(),
  })
