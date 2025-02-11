import { AdavanceNextAuth } from 'next-auth-oauth'

import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db'
import { AuthService } from '@/service/auth.service'
import { Gitee } from '@next-auth-oauth/gitee'
import { Feishu } from '@next-auth-oauth/feishu'
import Github from 'next-auth/providers/github'
import Wehcatmp from '@next-auth-oauth/wechatmp'
import { AuthConfig } from './auth.config'
import { captchaManager } from '@/service/captcha.service'
export const authAdapter = PrismaAdapter(prisma)
export const wechatMpProvder = Wehcatmp({
  captchaManager,
})

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
  providers: [Gitee, Github, Feishu, wechatMpProvder],
  adapter: authAdapter,
  userService: authService,
  autoBind: true,
})
