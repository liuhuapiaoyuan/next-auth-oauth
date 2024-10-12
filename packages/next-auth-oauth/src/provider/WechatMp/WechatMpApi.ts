import crypto from 'crypto'
export type COMMON_WECHATMP_MESSAGE = {
  FromUserName: string
  ToUserName: string
  MsgType: string
  Content: string
  MsgId: string
  EventKey?: string
  Encrypt?: string
}
type AccessTokenApiResult = {
  access_token: string
  /**
     * 凭证有效时间，单位：秒

     */
  expires_in: number
}
type QRCodeApiResult = {
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

export function checkSignature(
  signature: string,
  timestamp: string,
  nonce: string,
  token: string,
) {
  const tmpArr = [token, timestamp, nonce]
  tmpArr.sort()
  const tmpStr = tmpArr.join('')
  const hash = crypto.createHash('sha1').update(tmpStr).digest('hex')
  return hash === signature
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
 * 微信公众平台 API 调用工具
 * @see https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Access_Overview.html
 */
export class WechatMpApi {
  private appId: string
  private appSecret: string
  private accessTokenCacheManager: WehcatMpAccessTokenCacheManager
  /* 解密密钥*/
  private encoderAESKey?: string
  /* 消息令牌 */
  private token?: string
  constructor(options?: {
    appId: string
    appSecret: string
    /* 解密密钥*/
    encoderAESKey?: string
    /* 消息令牌 */
    token?: string
    /* Token缓存管理器 */
    accessTokenCacheManager: WehcatMpAccessTokenCacheManager
  }) {
    this.appId = options?.appId || process.env.AUTH_WECHATMP_APP_ID!
    this.appSecret = options?.appSecret || process.env.AUTH_WECHATMP_APP_SECRET!
    this.accessTokenCacheManager =
      options?.accessTokenCacheManager ||
      new InMemoryWechatMpAccessTokenCacheManager()
    this.token = options?.token ?? process.env.AUTH_WECHATMP_TOKEN
    this.encoderAESKey =
      options?.encoderAESKey ?? process.env.AUTH_WECHATMP_ENCODER_AESKEY
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

  async getAccessToken() {
    const cached = await this.accessTokenCacheManager.get(this.appId)
    if (cached) {
      return cached
    }
    const accessToken = await this.getAccessTokenFromBackend()
    await this.accessTokenCacheManager.set(this.appId, accessToken)
    return accessToken
  }

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

  createSignature(datas: string[]) {
    let tmpArr = [this.token, ...datas]
    tmpArr.sort()
    const tmpStr = tmpArr.join('')
    return crypto.createHash('sha1').update(tmpStr).digest('hex')
  }

  /**
   * 验证签名
   * 按照 加密方式,如果encrypt_type是aes，会通过msg_signature自动验签
   * 如果不是aes，则会通过 signature 字段验签
   * @param query
   */
  checkSignature(searchParams: URLSearchParams, Encrypt?: string) {
    let signature = searchParams.get('signature')
    const timestamp = searchParams.get('timestamp')
    const nonce = searchParams.get('nonce')
    const encrypt_type = searchParams.get('encrypt_type')

    //timestamp  nonce 必须有内容，用字符串判断
    if (!timestamp || !nonce) {
      throw new Error('签名验证失败:timestamp 或 nonce 为空')
    }

    let tmpArr = [this.token, timestamp, nonce]
    if (encrypt_type && encrypt_type == 'aes') {
      if (typeof Encrypt == 'undefined' || Encrypt === '') {
        throw new Error('加密消息缺失:{Encrypt}')
      }
      tmpArr = [this.token, timestamp, nonce, Encrypt]
      signature = searchParams.get('msg_signature')
    }
    tmpArr.sort()
    const tmpStr = tmpArr.join('')
    const hash = crypto.createHash('sha1').update(tmpStr).digest('hex')
    return hash === signature
  }

  decryptMessage(Encrypt: string) {
    // 1. Base64 解码 EncodingAESKey，生成 32 字节的 AESKey
    const AESKey = Buffer.from(this.encoderAESKey + '=', 'base64')
    // 2. Base64 解码 Encrypt 密文，得到 TmpMsg
    const encryptedMessage = Buffer.from(Encrypt, 'base64')
    // 3. 使用 AESKey 对 TmpMsg 进行 AES 解密（CBC 模式）
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      AESKey,
      AESKey.subarray(0, 16),
    ) // IV 是前 16 字节的 AESKey
    decipher.setAutoPadding(false) // 手动处理填充

    let decrypted = Buffer.concat([
      decipher.update(encryptedMessage),
      decipher.final(),
    ])
    decrypted = unpadPKCS7(decrypted)
    return decrypted.toString()
  }
  /**
   *  加密消息
   * @param xml xml格式的消息
   */
  encryptMessage(xml: string) {
    // 1. 生成 AESKey
    const AESKey = Buffer.from(this.encoderAESKey + '=', 'base64')

    // 2. 生成 FullStr
    const random = crypto.randomBytes(16) // 16 字节随机字符串
    const msg = Buffer.from(xml, 'utf-8') // 明文消息
    const msg_len = Buffer.alloc(4)
    msg_len.writeUInt32BE(msg.length, 0) // 网络字节序
    // 拼接 FullStr
    const FullStr = Buffer.concat([
      random,
      msg_len,
      msg,
      Buffer.from(this.appId, 'utf-8'),
    ])
    // 3. PKCS7 填充
    const blockSize = 32 // AES 密钥长度
    const paddedFullStr = padPKCS7(FullStr, blockSize)
    // 4. 使用 AESKey 加密
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      AESKey,
      AESKey.subarray(0, 16),
    ) // IV 为 AESKey 的前 16 字节
    let encrypted = Buffer.concat([
      cipher.update(paddedFullStr),
      cipher.final(),
    ])
    // 5. Base64 编码
    return encrypted.toString('base64')
  }
}
// 辅助函数：PKCS7 解码
function unpadPKCS7(buffer: Buffer) {
  const pad = buffer[buffer.length - 1]
  return buffer.slice(0, -pad)
}
// 辅助函数：PKCS7 填充
function padPKCS7(buffer: Buffer, blockSize: number) {
  const pad = blockSize - (buffer.length % blockSize)
  const padding = Buffer.alloc(pad, pad)
  return Buffer.concat([buffer, padding])
}
