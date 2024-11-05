import {
  InMemoryWechatMpAccessTokenCacheManager,
  type WehcatMpAccessTokenCacheManager,
} from './WehcatMpAccessTokenCacheManager'
import type { AccessTokenApiResult } from './type'
import { UserService } from './service/UserService'
import { MessageService } from './service/MessageService'

/**
 * 微信公众平台 API 调用工具
 * @see https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Access_Overview.html
 */
export class WechatMpApi {
  public appId: string
  private appSecret: string
  private accessTokenCacheManager: WehcatMpAccessTokenCacheManager
  private _userService?: UserService
  /**
   * 获得用户服务
   */
  get userService() {
    if (!this._userService) {
      this._userService = new UserService(this)
    }
    return this._userService
  }

  /**
   * 消息服务
   */
  private _messageService?: MessageService

  /**
   * 获得消息服务
   * @param token
   * @param encodingAESKey
   * @returns
   */
  getMessageService(token: string, encodingAESKey?: string) {
    if (!this._messageService) {
      this._messageService = new MessageService(this, {
        token,
        encodingAESKey,
        aesMode: !!encodingAESKey && encodingAESKey.length > 0,
      })
    }
    return this._messageService
  }

  constructor(options?: {
    appId: string
    appSecret: string
    accessTokenCacheManager?: WehcatMpAccessTokenCacheManager
  }) {
    const { appId, appSecret, accessTokenCacheManager } = Object.assign(
      {
        appId: process.env.AUTH_WECHATMP_APP_ID,
        appSecret: process.env.AUTH_WECHATMP_APP_SECRET,
      },
      options,
    )
    this.appId = appId
    this.appSecret = appSecret
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
   * 基础请求工具
   * @param endpoint
   * @param options
   * @returns
   */
  async request<T>(
    endpoint: string,
    options?: RequestInit & { queryParam?: Record<string, string> },
  ) {
    const url = `https://api.weixin.qq.com/cgi-bin${endpoint}`
    const queryParam = options?.queryParam ?? {}
    const accessToken = await this.getAccessToken()
    queryParam['access_token'] = accessToken.access_token
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(queryParam)) {
      if (value) {
        search.append(key, value)
      }
    }
    return fetch(url + '?' + search.toString(), options)
      .then((r) => r.json())
      .then((r) => {
        if (r.errcode) {
          throw new Error(r.errmsg)
        }
        return r as T
      })
  }
}
