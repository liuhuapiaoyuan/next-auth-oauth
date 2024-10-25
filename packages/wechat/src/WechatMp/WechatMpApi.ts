import crypto from 'crypto'
import { encryptMessage, randomStr } from './sign'

export type RequestXML = {
  FromUserName: string
  ToUserName: string
  MsgType: string
  Content: string
  MsgId: string
  EventKey?: string
}
export type ExcryptRequestXML = {
  Encrypt: string
  ToUserName: string
}

export type QueryParams = {
  signature: string
  timestamp: string
  nonce: string
  encrypt?: string
}

export type ResponseXML = {
  ToUserName: string
  FromUserName: string
  CreateTime: number
  MsgType: 'text'
  Content: string
}
export type AccessTokenApiResult = {
  access_token: string
  /**
     * 凭证有效时间，单位：秒

     */
  expires_in: number
}
export type QRCodeApiResult = {
  /**
   *  ticket	获取的二维码ticket，凭借此ticket可以在有效时间内换取二维码。
   */
  ticket: string
  /**
   * 该二维码有效时间，以秒为单位。 最大不超过2592000（即30天）。
   */
  expire_seconds: number
  /**
   * 二维码图片解析后的地址，开发者可根据该地址自行生成需要的二维码图片
   */
  url: string
}
export interface WehcatMpAccessTokenCacheManager {
  get(appId: string): Promise<AccessTokenApiResult | undefined>
  set(appId: string, value: AccessTokenApiResult): Promise<void>
}

export class InMemoryWechatMpAccessTokenCacheManager
  implements WehcatMpAccessTokenCacheManager
{
  private cache: Map<
    string,
    { value: AccessTokenApiResult; expiresAt: number }
  > = new Map()

  async get(appId: string): Promise<AccessTokenApiResult | undefined> {
    const cached = this.cache.get(appId)
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value
    }
    // 如果缓存过期或不存在，返回 undefined
    this.cache.delete(appId)
    return undefined
  }

  async set(appId: string, value: AccessTokenApiResult): Promise<void> {
    const expiresAt = Date.now() + value.expires_in * 1000
    this.cache.set(appId, { value, expiresAt })
  }
}

/**
 * 仅处理微信公众号消息的xml
 * @param xml
 * @returns
 */
export function parseWehcatMessageXML<T>(xml: string) {
  const result: Record<string, string> = {}
  // 匹配 XML 标签及其内容
  const regex = /<(\w+)>(.*?)<\/\1>/g
  let match

  while ((match = regex.exec(xml)) !== null) {
    const [, tag, content] = match
    // 处理 CDATA
    const cleanContent = content.replace(/^<!\[CDATA\[|\]\]>$/g, '')
    result[tag] = cleanContent
  }

  return result as T
}

/**
 * 提供 XML 输出
 * @param data
 * @returns
 */
export function renderXML(data: Record<string, string | number>) {
  const xmls = ['<xml>']
  for (const key in data) {
    const value = data[key]
    if (typeof value === 'number') {
      xmls.push(`<${key}>${value}</${key}>`)
    } else {
      xmls.push(`<${key}><![CDATA[${value}]]></${key}>`)
    }
  }
  xmls.push('</xml>')
  return xmls.join('')
}

/**
 * 微信公众平台 API 调用工具
 * @see https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Access_Overview.html
 */
export class WechatMpApi {
  /**
   *
   */
  private appId: string

  /**
   *
   */
  private appSecret: string

  /**
   * 开启解密
   */
  private encodingAESKey?: string

  private aesMode: boolean
  /**
   * 消息令牌
   */
  private token: string

  private accessTokenCacheManager: WehcatMpAccessTokenCacheManager

  constructor(options?: {
    appId: string
    token: string
    encodingAESKey?: string
    appSecret: string
    accessTokenCacheManager?: WehcatMpAccessTokenCacheManager
  }) {
    const { token, encodingAESKey, appId, appSecret, accessTokenCacheManager } =
      Object.assign(
        {
          appId: process.env.AUTH_WECHATMP_APP_ID,
          appSecret: process.env.AUTH_WECHATMP_APP_SECRET,
        },
        options,
      )
    this.token = token
    this.encodingAESKey = encodingAESKey
    this.appId = appId
    this.appSecret = appSecret
    this.aesMode = !!encodingAESKey && encodingAESKey.length > 0
    this.accessTokenCacheManager =
      accessTokenCacheManager ?? new InMemoryWechatMpAccessTokenCacheManager()
  }

  private async getAccessTokenFromBackend() {
    const body = {
      grant_type: 'client_credential',
      appid: this.appId,
      secret: this.appSecret,
    }
    const url = 'https://api.weixin.qq.com/cgi-bin/stable_token'
    const result = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
    if (result.errcode) {
      throw new Error(result.errmsg)
    }

    return result as AccessTokenApiResult
  }

  /**
   * 获得授权令牌
   * @returns
   */
  async getAccessToken() {
    const cached = await this.accessTokenCacheManager.get(this.appId)
    if (cached) {
      return cached
    }
    const accessToken = await this.getAccessTokenFromBackend()
    await this.accessTokenCacheManager.set(this.appId, accessToken)
    return accessToken
  }
  /**
   * 创建场景二维码
   * @param scene_str
   * @param expire_seconds
   * @returns
   */
  async createPermanentQrcode(scene_str: string, expire_seconds: number = 300) {
    const accessToken = await this.getAccessToken()
    const url = `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${accessToken.access_token}`
    const body = {
      expire_seconds,
      action_name: 'QR_STR_SCENE',
      action_info: {
        scene: {
          scene_str,
        },
      },
    }
    const result = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
    if (result.errcode) {
      throw new Error(result.errmsg)
    }
    return result as QRCodeApiResult
  }

  getPermanentQrcodeUrl(ticket: string) {
    return `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticket}`
  }

  /**
   * 校验前名的正确性
   * @param signature
   * @param timestamp
   * @param nonce
   * @param encrypt 需要从消息包中获得(body)
   * @returns
   */
  checkSign({ timestamp, nonce, encrypt, signature }: QueryParams) {
    const tmpArr = [this.token, timestamp, nonce]
      .concat(encrypt ? [encrypt] : [])
      .sort()
    const tmpStr = tmpArr.join('')
    const hash = crypto.createHash('sha1').update(tmpStr).digest('hex')
    return hash === signature
  }

  decryptXML(encrypted: string) {
    const aesKey = Buffer.from(this.encodingAESKey + '=', 'base64')
    const iv = aesKey.slice(0, 16)
    const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv)
    decipher.setAutoPadding(false)
    let decrypted = decipher.update(encrypted, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    const pad = decrypted.charCodeAt(decrypted.length - 1)
    return decrypted.slice(0, decrypted.length - pad)
  }

  /**
   * AES 加密函数
   * @param {string} message - 要加密的消息体
   * @param {string} encodingAESKey - 微信提供的 EncodingAESKey
   * @returns {string} - 加密后的消息体，Base64 编码
   */
  encryptMessage(message: string) {
    return encryptMessage(
      this.encodingAESKey!,
      randomStr(16),
      message,
      this.appId,
    )
  }
  /**
   * 解析输入消息
   */
  parserInput(input: string, params: Omit<QueryParams, 'encrypt'>) {
    if (!this.aesMode) {
      if (!this.checkSign(params)) {
        throw new Error('签名校验失败')
      }
      return parseWehcatMessageXML<RequestXML>(input)
    }
    const encryptXML = parseWehcatMessageXML<ExcryptRequestXML>(input).Encrypt
    if (!this.checkSign({ ...params, encrypt: encryptXML })) {
      throw new Error('签名校验失败')
    }
    const decryptXML = this.decryptXML(encryptXML)
    return parseWehcatMessageXML<RequestXML>(decryptXML)
  }

  /**
   * 获得输出xml
   * 如果是安全加密，则会自动加密
   * @param xml
   */
  renderMessage(message: ResponseXML) {
    const content = renderXML(message)
    if (!this.aesMode) {
      return content
    }
    const Encrypt = this.encryptMessage(content)
    const Nonce = randomStr(16)
    const TimeStamp = Math.floor(Date.now() / 1000).toString()
    const tmpArr = [this.token, TimeStamp, Nonce, Encrypt].sort()
    const tmpStr = tmpArr.join('')
    const MsgSignature = crypto.createHash('sha1').update(tmpStr).digest('hex')
    return renderXML({
      Encrypt: Encrypt,
      MsgSignature,
      TimeStamp,
      Nonce,
    })
  }
}
