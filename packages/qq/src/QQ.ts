import type { OAuth2Config, OAuthUserConfig } from 'next-auth/providers'

export interface QQProfile {
  /*   ret	返回码
msg	如果ret<0，会有相应的错误信息提示，返回数据全部用UTF-8编码
is_lost	判断是否有数据丢失。如果应用不使用cache，不需要关心此参数。0或者不返回：没有数据丢失，可以缓存。1：有部分数据丢失或错误，不要缓存
nickname	用户在QQ空间的昵称。
figureurl	大小为30×30像素的QQ空间头像URL。
figureurl_1	大小为50×50像素的QQ空间头像URL。
figureurl_2	大小为100×100像素的QQ空间头像URL。
figureurl_qq_1	大小为40×40像素的QQ头像URL。
figureurl_qq_2	大小为100×100像素的QQ头像URL。需要注意，不是所有的用户都拥有QQ的100x100的头像，但40x40像素则是一定会有。
gender	性别。 如果获取不到则默认返回"男"
gender_type	性别类型。默认返回2
province	省
city	市
year	年
constellation	星座
is_yellow_vip	标识用户是否为黄钻用户
yellow_vip_level	黄钻等级
is_yellow_year_vip	是否为年费黄钻用户 */
  /**
   * 判断是否有数据丢失。如果应用不使用cache，不需要关心此参数。0或者不返回：没有数据丢失，可以缓存。1：有部分数据丢失或错误，不要缓存
   */
  is_lost: number
  /**
   * 用户在QQ空间的昵称。
   */
  nickname: string
  /**
   * 大小为30×30像素的QQ空间头像URL。
   */
  figureurl: string
  /**
   * 大小为50×50像素的QQ空间头像URL。
   */
  figureurl_1: string
  /**
   * 大小为100×100像素的QQ空间头像URL。
   */
  figureurl_2: string
  /**
   * 大小为40×40像素的QQ头像URL。
   */
  figureurl_qq_1: string
  /**
   * 大小为100×100像素的QQ头像URL。需要注意，不是所有的用户都拥有QQ的100x100的头像，但40x40像素则是一定会有。
   */
  figureurl_qq_2: string
  /**
   * 性别。 如果获取不到则默认返回"男"
   */
  gender: string
  /**
   * 性别类型。默认返回2
   */
  gender_type: number
  /**
   * 省
   */
  province: string
  /**
   * 市
   */
  city: string
  /**
   * 年
   */
  year: string
  /**
   * 星座
   */
  constellation: string
  /**
   * 标识用户是否为黄钻用户
   */
  is_yellow_vip: number
  /**
   * 黄钻等级
   */
  yellow_vip_level: number
  /**
   * 是否为年费黄钻用户
   */
  is_yellow_year_vip: number
}

/**
 * QQ 授权登录服务
 *
 * [文档](打开：https://wiki.connect.qq.com/%e5%87%86%e5%a4%87%e5%b7%a5%e4%bd%9c_oauth2-0)
 * [QQ互联开通应用](打开：https://connect.qq.com/manage.html#/)
 *
 * @param options
 * @returns
 */
export function QQ<P extends QQProfile>(
  options: OAuthUserConfig<P> = {},
): OAuth2Config<P> {
  const {
    clientId = process.env.AUTH_QQ_ID!,
    clientSecret = process.env.AUTH_QQ_SECRET!,
    checks = ['state'],
    ...rest
  } = options

  return {
    id: 'QQ',
    name: 'QQ登录',
    type: 'oauth',
    style: { logo: '/providers/qq2.svg', brandColor: '#fff', text: '#000' },
    checks: checks as ['state'],
    clientId,
    clientSecret,
    authorization: {
      url: 'https://graph.qq.com/oauth2.0/authorize',
    },
    userinfo: {
      url: 'https://graph.qq.com/user/get_user_info',
      async request({ tokens, provider }: any) {
        const url = new URL(provider.userinfo?.url!)
        url.searchParams.set('access_token', tokens.access_token!)
        url.searchParams.set('openid', String(tokens.openid))
        url.searchParams.set('oauth_consumer_key', clientId)
        const response = await fetch(url)
        return response.json()
      },
    },
    token: {
      url: 'https://graph.qq.com/oauth2.0/token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        code: 'CODE',
        need_openid: 1,
        fmt: 'json',
        grant_type: 'authorization_code',
      },
      conform: async (response: Response) => {
        const data = await response.json()
        return new Response(
          JSON.stringify({
            ...data,
            token_type: 'bearer',
          }),
          response,
        )
      },
    },
    profile: (profile, tokens) => {
      return {
        id: tokens.openid + '',
        name: profile.nickname,
        username: tokens.openid,
        email: tokens.openid + '@qq_oauth.comm',
        image: profile.figureurl_2 ?? profile.figureurl,
      }
    },
    ...rest,
  }
}
