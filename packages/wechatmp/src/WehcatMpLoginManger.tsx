import { WechatMpApi } from 'wechatmp-kit'
import type { CaptchaManager } from './lib/CaptchaManager'
import { QrcodePage } from './pages/qrcode'
function isBlank(str?: string) {
  return str === undefined || str === null || str.trim() === ''
}
/**
 * 微信公众号登录管理器配置接口
 */
export interface WechatMpLoginManagerConfig {
  /** 微信公众号的AppID */
  appId: string
  /** 微信公众号的AppSecret */
  appSecret: string
  /** 用于验证消息的Token */
  token: string
  /** 消息加解密密钥，可选 */
  aesKey?: string
  /**
   * 验证类型 "MESSAGE"|"QRCODE"
   * - MESSAGE 回复消息
   * - QRCODE 临时二维码
   * - 默认使用环境变量 AUTH_WECHATMP_CHECKTYPE
   * @default "MESSAGE"
   */ checkType?: 'QRCODE' | 'MESSAGE'
  /**
   * ### 一般为**公众号关注二维码**
   * ##### 用于引导用户扫码关注公众号后，方便发送验证码
   * ##### 当checkType为MESSAGE时必须配置此参数
   */
  qrcodeImageUrl?: string
  /**
   * 指定的API端点
   * @default /api/auth/wechatmp
   */
  endpoint?: string
  /** 验证码管理器，用于处理验证码相关操作 */
  captchaManager: CaptchaManager<{ openid: string; unionid?: string }>
}

/**
 * 微信公众号登录管理器
 * 用于处理微信公众号登录流程，包括二维码生成、验证码管理、消息处理等
 * 支持二维码扫描和消息验证两种登录方式
 */
export class WechatMpLoginManager {
  private wechatMpApi: WechatMpApi
  private captchaManager: CaptchaManager
  private checkType: 'QRCODE' | 'MESSAGE' = 'MESSAGE'
  private qrcodeImageUrl?: string
  private messageServicde: ReturnType<WechatMpApi['getMessageService']>
  private endpoint: string
  constructor(config: WechatMpLoginManagerConfig) {
    const { checkType = 'MESSAGE', qrcodeImageUrl } = config
    // 验证MESSAGE
    if (checkType === 'MESSAGE' && isBlank(qrcodeImageUrl)) {
      throw new Error('checkType为MESSAGE时，必须配置qrcodeImageUrl')
    }
    this.checkType = checkType
    this.qrcodeImageUrl = qrcodeImageUrl
    this.wechatMpApi = new WechatMpApi({
      appId: config.appId,
      appSecret: config.appSecret,
    })
    this.captchaManager = config.captchaManager
    this.messageServicde = this.wechatMpApi.getMessageService(
      config.token,
      config.aesKey!,
    )
    this.endpoint = config.endpoint ?? '/api/auth/wechatmp'

    console.log('👏[auth.js/微信公众号登录插件]👏')
    console.log('请注意以下参数')
    console.log(`微信端消息回调：${this.endpoint}`)
    console.log(`微信端消息验证类型：${this.checkType}`)
    if (this.checkType === 'QRCODE') {
      console.log(`⚠️ 注意：只有认证的微信号才能使用二维码登录！🔐`)
    }
  }

  /**
   * 创建验证码
   * @returns {Promise<string>} 生成的验证码
   */
  async createCaptcha(): Promise<string> {
    return this.captchaManager.generate()
  }

  /**
   * 验证验证码并绑定openid
   * @param {string} openid 用户的openid
   * @param {string} captcha 用户输入的验证码
   * @returns {Promise<boolean>} 验证结果
   */
  async verifyCaptcha(openid: string, captcha: string): Promise<boolean> {
    return this.captchaManager.updateData(captcha, { openid })
  }

  /**
   * 渲染关注二维码HTML页面
   * @returns {string} 渲染后的HTML
   */
  private async qrcodeAction(request: Request): Promise<Response> {
    const link = new URL(request.url)

    const captcha = await this.createCaptcha()
    let imgLink = this.qrcodeImageUrl!
    if (this.checkType === 'QRCODE') {
      const t = await this.messageServicde.createPermanentQrcode(captcha)
      imgLink = t.url
    }
    const redirectUri = link.searchParams.get('redirect_uri')!
    const html = QrcodePage({
      checkType: this.checkType,
      qrcode: imgLink,
      code: captcha,
      redirectUri,
      checkLoginApi: this.endpoint + '?action=check',
    })
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  }
  /**
   * 处理next-auth的token请求,返回openid
   * @param request
   * @returns
   */
  private async tokenAction(request: Request): Promise<Response> {
    const data = await request.formData()
    const valid = await this.captchaManager.getData(
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
  }

  /**
   * 二维码页面，轮训获取openid
   * @param request
   * @returns
   */
  private async checkAction(request: Request): Promise<Response> {
    const { code } = await request.json()
    try {
      const exist = await this.captchaManager.exists(code)
      if (!exist) {
        return Response.json({ type: 'fail', error: '验证码不存在' })
      }
      const valid = await this.captchaManager.getData(code)
      if (valid?.openid) {
        return Response.json({ type: 'success' })
      } else {
        return Response.json({ type: 'wait' })
      }
    } catch (error) {
      return Response.json({ type: 'fail', error: JSON.stringify(error) })
    }
  }

  /**
   * 处理微信消息(webhook)
   * @param {any} message 微信消息内容
   * @returns {Promise<void>}
   */
  async handleWechatMessage(request: Request): Promise<Response> {
    const link = new URL(request.url)
    const timestamp = link.searchParams.get('timestamp')!
    const nonce = link.searchParams.get('nonce')!
    const signature = link.searchParams.get('signature')!
    const echo = link.searchParams.get('echostr')
    if (timestamp && nonce && signature && echo) {
      if (this.messageServicde.checkSign({ timestamp, nonce, signature })) {
        return new Response(echo)
      }
      return new Response('验证失败', { status: 405 })
    }
    // 获得xml消息报
    const msg_signature = link.searchParams.get('msg_signature')
    const encrypt_type = link.searchParams.get('encrypt_type')
    const body = await request.text()
    const message = this.messageServicde.parserInput(body, {
      timestamp,
      nonce,
      signature: (encrypt_type === 'aes' ? msg_signature : signature)!,
    })
    let content = ''
    if (message.EventKey && message.MsgType == 'event') {
      content = message.EventKey.replace('qrscene_', '')
    } else if (message.MsgType == 'text') {
      content = message.Content.trim()
    }

    const status = await this.captchaManager.updateData(content, {
      openid: message.FromUserName,
    })
    const result = this.messageServicde.renderMessage({
      ToUserName: message.FromUserName,
      FromUserName: message.ToUserName,
      CreateTime: Math.floor(Date.now() / 1000),
      MsgType: 'text',
      Content: status ? '👏👏登录成功' : '😭登录失败,请重新获得验证码',
    })
    return new Response(result, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  }

  /**
   * 适配NextAuth的authorization页面
   * @param {string} captcha 验证码
   * @returns {string} 回调URL
   */
  getAuthorizationUrl(captcha: string): string {
    return `/api/auth/callback/wechatmp?code=${captcha}`
  }
  /**
   * 暴露给nextjs的处理函数
   * @param request
   * @returns
   */
  handle(request: Request) {
    const link = new URL(request.url)
    const action = link.searchParams.get('action')
    if (action === 'qrcode') {
      return this.qrcodeAction(request)
    }
    if (action === 'token') {
      return this.tokenAction(request)
    }
    if (action === 'check') {
      return this.checkAction(request)
    }

    // 验证消息
    return this.handleWechatMessage(request)
  }
}
