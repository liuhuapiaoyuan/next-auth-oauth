import type {
  AccountCallback,
  AuthorizationEndpointHandler,
  OAuth2Config,
  OAuthUserConfig,
  TokenEndpointHandler,
  UserinfoEndpointHandler,
} from 'next-auth/providers'
import { WechatMpApi } from 'wechatmp-kit'
import { CaptchaManager } from './lib/CaptchaManager'
import { QrcodePage } from './pages/qrcode'

export type WechatPlatformConfig = {
  /**
   * 验证类型 "MESSAGE"|"QRCODE"
   * - MESSAGE 回复消息
   * - QRCODE 临时二维码
   * - 默认使用环境变量 AUTH_WECHATMP_CHECKTYPE
   * @default "MESSAGE"
   */
  checkType?: 'MESSAGE' | 'QRCODE'

  /**
   * ### 一般为**公众号关注二维码**
   * ##### 用于引导用户扫码关注公众号后，方便发送验证码
   * ##### 当checkType为MESSAGE时必须配置此参数
   */
  qrcodeImageUrl?: string
  /**
   * 认证账号必须提供
   * 提供二维码创建工具，
   */
  wechatMpApi: WechatMpApi

  /**
   * 页面接口，包含:
   * - 二维码展示页面
   * - 微信消息回调页面
   * 默认使用环境变量 AUTH_WECHATMP_ENDPOINT
   */
  endpoint?: string
}

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
function checkPrint() {
  // @ts-expect-error printFlag
  if (global.printFlag === false) {
    // @ts-expect-error printFlag
    global.printFlag = true
    return false
  }
  return true
}

type WechatMpResult = {
  GET: (req: Request) => Promise<Response>
  POST: (req: Request) => Promise<Response>
}

function isBlank(str?: string) {
  return str === undefined || str === null || str.trim() === ''
}
/**
 * 微信公众号平台(验证码登录)
 * [体验账号申请](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)
 *
 * @param options
 * @returns
 */
export default function WeChatMp<P extends WechatMpProfile>(
  options: OAuthUserConfig<P> & WechatPlatformConfig,
): OAuth2Config<P> & WechatMpResult {
  const { wechatMpApi, checkType, endpoint, qrcodeImageUrl } = Object.assign(
    {
      endpoint:
        process.env.AUTH_WECHATMP_ENDPOINT ??
        'http://localhost:3000/api/auth/wechatmp',
      checkType: process.env.AUTH_WECHATMP_CHECKTYPE ?? 'MESSAGE',
      qrcodeImageUrl: process.env.AUTH_WECHATMP_QRCODE_IMAGE_URL,
    },
    options ?? {},
  )
  const captchaManager = new CaptchaManager()

  // 验证MESSAGE
  if (checkType === 'MESSAGE' && isBlank(qrcodeImageUrl)) {
    throw new Error('checkType为MESSAGE时，必须配置qrcodeImageUrl')
  }

  const messageServicde = wechatMpApi.getMessageService(
    process.env.AUTH_WECHATMP_TOKEN!,
    process.env.AUTH_WECHATMP_AESKEY!,
  )
  //  检验endpoint是否是完整的http
  const endpointUrl = new URL(endpoint)

  //   跳转页面，也就是二维码
  const authorization: AuthorizationEndpointHandler = {
    url: endpointUrl.toString(),
    params: {
      client_id: wechatMpApi.appId,
      response_type: 'code',
      action: 'qrcode',
    },
  }

  // 从callback中获得state,code 然后进一步获取
  const token: TokenEndpointHandler = {
    url: endpoint,
    params: {
      action: 'token',
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

  const userinfo: UserinfoEndpointHandler = {
    url: 'http://localhost:3000/auth/qrcode2',
    async request({ tokens }: { tokens: { access_token: string } }) {
      return {
        openid: tokens.access_token,
      }
    },
  }

  async function GET(request: Request): Promise<Response> {
    const link = new URL(request.url)
    const action = link.searchParams.get('action')
    const redirectUri = link.searchParams.get('redirect_uri')!
    // 微信消息验证
    const timestamp = link.searchParams.get('timestamp')
    const nonce = link.searchParams.get('nonce')
    const signature = link.searchParams.get('signature')
    const echo = link.searchParams.get('echostr')
    if (timestamp && nonce && signature && echo) {
      if (messageServicde.checkSign({ timestamp, nonce, signature })) {
        return new Response(echo)
      }
      return new Response('验证失败', { status: 405 })
    }
    if (action === 'qrcode') {
      const code = await captchaManager.generate()
      let imgLink = qrcodeImageUrl!
      if (checkType === 'QRCODE') {
        const t = await messageServicde.createPermanentQrcode(code)
        //imgLink = `https://zddydd.com/qrcode/build?label=&logo=0&labelalignment=center&foreground=%23000000&background=%23ffffff&size=300&padding=10&logosize=50&labelfontsize=14&errorcorrection=medium&text=${encodeURI(t.url)}`
        imgLink = t.url
      }
      const html = QrcodePage({
        checkType,
        qrcode: imgLink,
        code,
        redirectUri,
        endpoint,
      })
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
    }

    return Response.json({ data: 1 })
  }
  async function POST(request: Request): Promise<Response> {
    // 微信消息验证
    const link = new URL(request.url)

    const action = link.searchParams.get('action')
    if (action === 'token') {
      const data = await request.formData()
      const valid = await captchaManager.validCode(
        data.get('code')?.toString() ?? '',
      )
      if (valid?.openid) {
        return Response.json({
          scope: 'openid',
          access_token: valid.openid,
          token_type: 'bearer',
        })
      }
      return Response.json({
        error: 'invalid_grant',
        error_description: '验证码错误',
      })
    } else if (action === 'check') {
      const { code } = await request.json()
      try {
        const valid = await captchaManager.validCode(code)
        if (valid?.openid) {
          return Response.json({ type: 'success' })
        }
      } catch (_) {
        return Response.json({ type: 'fail' })
      }
      return Response.json({ type: 'checking' })
    }

    const timestamp = link.searchParams.get('timestamp')!
    const nonce = link.searchParams.get('nonce')!
    const signature = link.searchParams.get('signature')!
    const echo = link.searchParams.get('echostr')
    if (timestamp && nonce && signature && echo) {
      if (messageServicde.checkSign({ timestamp, nonce, signature })) {
        return new Response(echo)
      }
      return new Response('验证失败', { status: 405 })
    }
    // 获得xml消息报
    const msg_signature = request.headers.get('msg_signature')
    const body = await request.text()
    const message = messageServicde.parserInput(body, {
      timestamp,
      nonce,
      signature: msg_signature ?? signature,
    })
    let content = ''
    if (message.EventKey && message.MsgType == 'event') {
      content = message.EventKey.replace('qrscene_', '')
    } else if (message.MsgType == 'text') {
      content = message.Content.trim()
    }

    const status = await captchaManager.complted(content, {
      openid: message.FromUserName,
    })
    const result = messageServicde.renderMessage({
      ToUserName: message.FromUserName,
      FromUserName: message.ToUserName,
      CreateTime: Math.floor(Date.now() / 1000),
      MsgType: 'text',
      Content: status ? '登录成功' : '登录失败,请重新获得验证码',
    })

    return new Response(result, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  }

  if (!checkPrint()) {
    console.log('[auth.js/微信公众号登录插件]')
    console.log('请注意以下参数')
    console.log(`微信端消息回调：${endpoint}`)
    console.log(`微信端消息验证类型：${options.checkType}`)
  }

  return {
    GET,
    POST,
    account,
    clientId: wechatMpApi.appId,
    clientSecret: 'TEMP',
    id: 'wechatmp',
    name: '微信公众号登录',
    type: 'oauth' as const,
    style: {
      logo: '/providers/wechatOfficialAccount.svg',
      bg: '#fff',
      text: '#000',
    },
    userinfo,
    checks: ['none'] as ['none'],
    authorization,
    token,
    profile,
  }
}
