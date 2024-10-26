import type {
  AuthorizationEndpointHandler,
  OAuth2Config,
  OAuthUserConfig,
  UserinfoEndpointHandler,
} from 'next-auth/providers'
import { NextRequest } from 'next/server'
import {
  checkSignature,
  parseWehcatMessageXML,
  WechatMpApi,
} from './WechatMpApi'
import { WechatMpCaptchaManager } from './WechatPlatformConfig'

const globalForPrisma = globalThis as unknown as {
  wechatMpCaptchaManager: WechatMpCaptchaManager
}

export const wechatMpCaptchaManager =
  globalForPrisma.wechatMpCaptchaManager || new WechatMpCaptchaManager()

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.wechatMpCaptchaManager = wechatMpCaptchaManager

export type WechatPlatformConfig = {
  clientId?: string
  clientSecret?: string
  /* 解密密钥*/
  encoderAESKey?: string
  /* 消息令牌 */
  token?: string
  /**
   * 验证类型 "MESSAGE"|"QRCODE"
   * MESSAGE 回复消息
   * QRCODE 临时二维码
   * @default "MESSAGE"
   */
  type: 'MESSAGE' | 'QRCODE'
  /**
   * 认证账号必须提供
   * 提供二维码创建工具，
   */
  wechatMpApi: WechatMpApi
}

export type WechatMpProfile = {
  /**
   * 公众号扫码只能获得openid
   */
  openid: string
  unionid: string
}

type WeChatMpResp<P extends WechatMpProfile> = OAuth2Config<P> & {
  handler: {
    GET: (req: NextRequest) => Promise<Response>
    POST: (req: NextRequest) => Promise<Response>
  }
  getScanUrl: () => Promise<{
    qrcode: string
    type: 'MESSAGE' | 'QRCODE'
    ticket: string
  }>
  options?: OAuthUserConfig<P> & WechatPlatformConfig
}

/**
 * 微信公众号平台
 * [体验账号申请](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)
 *
 * @param options
 * @returns
 */
export default function WeChatMp<P extends WechatMpProfile>(
  options?: OAuthUserConfig<P> & WechatPlatformConfig,
): WeChatMpResp<P> {
  const { clientId, clientSecret, encoderAESKey, token, type, wechatMpApi } =
    Object.assign(
      {
        clientId: process.env.AUTH_WECHATMP_APP_ID!,
        clientSecret: process.env.AUTH_WECHATMP_APP_SECRET!,
        encoderAESKey: process.env.AUTH_WECHATMP_ENCODER_AESKEY,
        token: process.env.AUTH_WECHATMP_TOKEN!,
        type: process.env.AUTH_WECHATMP_TYPE ?? 'MESSAGE',
      },
      options,
    )

  if (!clientId || !clientSecret || !token) {
    throw new Error(
      'WechatMp platform requires client_id, client_secret, token',
    )
  }
  if (type === 'QRCODE' && typeof wechatMpApi === 'undefined') {
    throw new Error('WechatMpApi is required for QRCODE type')
  }

  const authorization: AuthorizationEndpointHandler = {
    url: 'http://localhost:3000/auth/qrcode',
    params: {
      appid: clientId,
      response_type: 'code',
      state: 'wechatmp',
    },
  }

  const userinfo: UserinfoEndpointHandler = {
    url: 'http://localhost:3000/auth/qrcode2',
    async request({ tokens }: any) {
      return {
        openid: tokens.access_token,
      }
    },
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

  const handler = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const signature = searchParams.get('signature')
    const echostr = searchParams.get('echostr')
    const timestamp =
      searchParams.get('msg_signature') || searchParams.get('timestamp')
    const nonce = searchParams.get('nonce')
    if (!signature || !timestamp || !nonce) {
      return new Response('Invalid Request', { status: 401 })
    }
    const isGET = req.method == 'GET'
    const query = { timestamp, nonce, signature }
    if (isGET && wechatMpApi.checkSign(query)) {
      return new Response(echostr, { status: 200 })
    } else {
      const xml = await req.text()
      const message = await wechatMpApi.parserInput(xml, query)
      const code = message.EventKey ?? message.Content
      const status = await wechatMpCaptchaManager.complted(code, {
        openid: message.FromUserName,
      })
      const responseXML = wechatMpApi.renderMessage({
        ToUserName: message.FromUserName,
        FromUserName: message.ToUserName,
        CreateTime: Math.floor(Date.now() / 1000),
        MsgType: 'text',
        Content: status ? '登录成功' : '登录失败,请重新获得验证码',
      })
      return new Response(responseXML, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      })
    }
  }

  return {
    id: 'wechatmp',
    name: '微信公众号扫码关注登录',
    type: 'oauth',
    style: {
      logo: '/providers/wechatOfficialAccount.svg',
      bg: '#fff',
      text: '#000',
    },
    checks: ['none'],
    clientId,
    clientSecret,
    authorization,
    token: {
      url: 'http://localhost:3000/api/auth/wechatmp',
    },
    userinfo,
    profile,
    handler: {
      GET: handler,
      POST: handler,
    },
    async getScanUrl() {
      const code = await wechatMpCaptchaManager.generate()
      if (type === 'QRCODE' && wechatMpApi) {
        const { url } = await wechatMpApi.createPermanentQrcode(code)
        return {
          qrcode: url,
          ticket: code,
          type: 'QRCODE',
        }
      } else {
        return {
          qrcode: 'https://cdn.kedao.ggss.club/picgo0',
          ticket: code,
          type: 'MESSAGE',
        }
      }
    },
  }
}
