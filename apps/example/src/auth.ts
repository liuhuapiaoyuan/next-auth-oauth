import { AdavanceNextAuth } from 'next-auth-oauth'

import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db'
import { AuthService } from '@/service/auth.service'
import { Gitee } from '@next-auth-oauth/gitee'
import Github from 'next-auth/providers/github'
import Wehcatmp from '@next-auth-oauth/wechatmp'
import { WechatMpApi } from 'wechatmp-kit'
import { AuthConfig } from './auth.config'

export const authAdapter = PrismaAdapter(prisma)
export const wechatMpProvder = Wehcatmp({
  wechatMpApi: new WechatMpApi({
    appId: process.env.AUTH_WECHATMP_APPID!,
    appSecret: process.env.AUTH_WECHATMP_APPSECRET!,
  }),
  endpoint: 'http://localhost:3000/api/auth/wechatmp',
  qrcodeImageUrl:
    'https://oauth.chanlun.ggss.club/uploads/20240121/3fec8aa97489ad13a734c500038822a3.jpg',
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
  providers: [Gitee, Github, wechatMpProvder],
  adapter: authAdapter,
  userService: authService,
  autoBind: true,
})
