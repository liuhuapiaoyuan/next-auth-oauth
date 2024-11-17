import crypto from 'crypto'
import { encryptMessage, randomStr } from './sign'
import { type WechatMpApi } from '../WechatMpApi'
import type {
  ExcryptRequestXML,
  QRCodeApiResult,
  QueryParams,
  RequestXML,
  ResponseXML,
} from '../type'
import { parseWehcatMessageXML, renderXML } from '../utils'

/**
 * 消息服务
 */
export class MessageService {
  private api: WechatMpApi
  /**
   * 开启解密
   */
  private encodingAESKey?: string

  private aesMode: boolean
  /**
   * 消息令牌
   */
  private token: string
  constructor(
    api: WechatMpApi,
    options: {
      token: string
      aesMode: boolean
      encodingAESKey?: string
    },
  ) {
    this.api = api
    this.token = options.token
    this.aesMode = options.aesMode
    this.encodingAESKey = options.encodingAESKey
  }

  /**
   * 创建场景二维码
   * @param scene_str
   * @param expire_seconds
   * @returns
   */
  async createPermanentQrcode(scene_str: string, expire_seconds: number = 300) {
    const accessToken = await this.api.getAccessToken()
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
      this.api.appId,
    )
  }
  /**
   * 解析输入消息
   * 1: 如果有AES加密，会先解包获得encrypt，然后解包xml
   * 2: 校验签名
   */
  parserInput(input: string, params: Omit<QueryParams, 'encrypt'>) {
    if (!this.aesMode) {
      if (!this.checkSign(params)) {
        throw new Error('消息请求签名校验失败')
      }
      return parseWehcatMessageXML<RequestXML>(input)
    }
    const encryptXML = parseWehcatMessageXML<ExcryptRequestXML>(input).Encrypt
    if (!this.checkSign({ ...params, encrypt: encryptXML })) {
      throw new Error('消息包签名校验失败 ')
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
    // 随机数字 0~4294967295
    const Nonce = Math.floor(Math.random() * 4294967295)
    const TimeStamp = Math.floor(Date.now() / 1000)
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
