import type { WechatMpApi } from '../WechatMpApi'

export type UserGetResp = {
  total: number
  count: number
  data: {
    openid: string[]
  }
  next_openid: string
}

export type UserTagGetResp = {
  count: number
  data: {
    openid: string[]
  }
  next_openid: string
}

export class UserService {
  private api: WechatMpApi
  constructor(api: WechatMpApi) {
    this.api = api
  }

  async userGet(next_openid?: string) {
    const data = await this.api.request<UserGetResp>('/user/get', {
      queryParam: next_openid
        ? {
            next_openid: next_openid!,
          }
        : {},
    })
    return data
  }
  async userTagGet(tagid: number, next_openid?: string) {
    const data = await this.api.request<UserTagGetResp>('/user/tag/get', {
      body: JSON.stringify({
        tagid,
        next_openid: next_openid!,
      }),
      method: 'POST',
    })
    return data
  }
  /**
   * 获得标签
   * @returns
   */
  async tagsGet() {
    return this.api.request<{
      tags: { id: number; name: string; count: number }[]
    }>('/tags/get')
  }
  /**
   * 发送模板消息
   * @param data
   * @returns
   */
  async messageTemplateSend(data: {
    touser: string
    template_id: string
    url?: string
    miniprogram?: {
      appid: string
      pagepath?: string
    }
    client_msg_id?: string
    data: Record<
      string,
      {
        value: string
      }
    >
  }) {
    return this.api.request<{ msgid: string }>('/message/template/send', {
      body: JSON.stringify(data),
      method: 'POST',
    })
  }
}
