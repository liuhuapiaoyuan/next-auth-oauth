import type {
  AccountCallback,
  AuthorizationEndpointHandler,
  OAuth2Config,
  OAuthUserConfig,
  TokenEndpointHandler,
  UserinfoEndpointHandler,
} from 'next-auth/providers'
import { MemoryCaptchaManager } from './lib/CaptchaManager'
import {
  WechatMpLoginManager,
  type WechatMpLoginManagerConfig,
} from './WehcatMpLoginManger'

export * from './lib/CaptchaManager'

export type WechatMpProfile = {
  /**
   * 公众号扫码只能获得openid
   */
  openid: string
  /**
   *
   */
  unionid: string
}

type WechatMpResult = {
  GET: (req: Request) => Promise<Response>
  POST: (req: Request) => Promise<Response>
}

/**
 * 微信公众号平台(验证码登录)
 * [体验账号申请](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)
 *
 * @param options
 * @returns
 */
export default function WeChatMp<P extends WechatMpProfile>(
  options: OAuthUserConfig<P> & Partial<WechatMpLoginManagerConfig>,
): OAuth2Config<P> & WechatMpResult {
  const {
    checks: _checks,
    captchaManager,
    checkType,
    endpoint,
    qrcodeImageUrl,
    aesKey,
    token,
    appId,
    appSecret,
    ...reset
  } = Object.assign(
    {
      captchaManager: new MemoryCaptchaManager(),
      appId: process.env.AUTH_WECHATMP_APPID ?? 'TEMP',
      appSecret: process.env.AUTH_WECHATMP_APPSECRET ?? 'TEMP',
      token: process.env.AUTH_WECHATMP_TOKEN ?? 'TEMP',
      endpoint:
        process.env.AUTH_WECHATMP_ENDPOINT ??
        'http://localhost:3000/api/auth/wechatmp',
      checkType: process.env.AUTH_WECHATMP_CHECKTYPE ?? 'MESSAGE',
      qrcodeImageUrl: process.env.AUTH_WECHATMP_QRCODE_IMAGE_URL,
    },
    options ?? {},
  )

  const endpointUrl = new URL(endpoint)
  const wechatMPLoginManager = new WechatMpLoginManager({
    captchaManager,
    checkType,
    endpoint,
    qrcodeImageUrl,
    appId,
    appSecret,
    token,
    aesKey,
  })
  //   跳转页面，也就是二维码
  const authorization: AuthorizationEndpointHandler = {
    url: endpointUrl.toString(),
    params: {
      client_id: appId,
      response_type: 'code',
      action: 'qrcode',
    },
  }
  /**
   * 账户信息
   * @param tokens
   * @returns
   */
  const account: AccountCallback = (tokens) => {
    return {
      access_token: tokens.access_token,
      expires_at: Date.now(),
      refresh_token: '',
      refresh_token_expires_at: Date.now(),
    }
  }
  const profile = (profile: WechatMpProfile) => {
    const openid = profile.unionid ?? profile.openid
    return {
      id: openid,
      name: openid,
      email: openid + '@wechat.com',
      raw: profile,
    }
  }
  const userinfo: UserinfoEndpointHandler = {
    //由于next-auth会校验url的合理，这里就随意填写
    url: 'http://localhost:3000/auth/qrcode2',
    async request({ tokens }: { tokens: { access_token: string } }) {
      return {
        openid: tokens.access_token,
      }
    },
  }

  // 从callback中获得state,code 然后进一步获取
  const tokenEndpoint: TokenEndpointHandler = {
    url: endpoint,
    params: {
      action: 'token',
    },
  }

  return {
    GET: (req: Request) => wechatMPLoginManager.handle(req),
    POST: (req: Request) => wechatMPLoginManager.handle(req),
    account,
    clientId: appId,
    clientSecret: appSecret,
    id: 'wechatmp',
    name: '微信公众号登录',
    type: 'oauth' as const,
    style: {
      logo: '/providers/wechatOfficialAccount.svg',
      bg: '#fff',
      text: '#000',
    },
    userinfo,
    profile,
    authorization,
    checks: ['none'] as ['none'],
    token: tokenEndpoint,
    ...reset,
  }
}
