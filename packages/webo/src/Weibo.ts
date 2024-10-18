import type { OAuth2Config, OAuthUserConfig } from 'next-auth/providers'

export interface WeiboProfile {
  /**
 
    /** 用户的唯一标识符 */
  id: number

  /** 用户在平台上的用户名 */
  screen_name: string

  /** 用户的显示名称 */
  name: string

  /** 头像 */
  profile_image_url?: string

  /** 用户所在省份的代码 */
  province: string

  /** 用户所在城市的代码 */
  city: string

  /** 用户的具体位置 */
  location: string

  /** 用户的个人描述 */
  description: string

  /** 用户的个人网站链接 */
  url: string

  /** 用户的个人域名 */
  domain: string

  /** 用户的性别 */
  gender: string // 'm' 表示男性， 'f' 表示女性

  /** 用户的粉丝数量 */
  followers_count: number

  /** 用户的好友数量 */
  friends_count: number

  /** 用户的微博状态数量 */
  statuses_count: number

  /** 用户的收藏数量 */
  favourites_count: number

  /** 用户创建账户的时间 */
  created_at: string // 时间格式: "Fri Aug 28 00:00:00 +0800 2009"

  /** 用户是否关注 */
  following: boolean

  /** 用户是否允许所有人发送私信 */
  allow_all_act_msg: boolean

  /** 用户是否地理定位 */
  geo_enabled: boolean

  /** 用户是否认证 */
  verified: boolean

  /** 用户的最新状态信息 */
  status: Status

  /** 用户是否允许所有人评论 */
  allow_all_comment: boolean

  /** 用户的大头像 URL */
  avatar_large: string

  /** 用户认证理由 */
  verified_reason: string

  /** 用户是否被关注 */
  follow_me: boolean

  /** 用户的在线状态 */
  online_status: number // 0: 离线， 1: 在线

  /** 用户的互粉数量 */
  bi_followers_count: number
}

/**
 * 用户最新状态类型定义
 */
type Status = {
  /** 状态创建时间 */
  created_at: string // 时间格式: "Tue May 24 18:04:53 +0800 2011"

  /** 状态的唯一标识符 */
  id: number

  /** 状态的文本内容 */
  text: string

  /** 状态来源的描述 */
  source: string

  /** 状态是否被收藏 */
  favorited: boolean

  /** 状态内容是否被截断 */
  truncated: boolean

  /** 回复的状态 ID */
  in_reply_to_status_id: string

  /** 回复的用户 ID */
  in_reply_to_user_id: string

  /** 回复的用户名 */
  in_reply_to_screen_name: string

  /** 微博中间件 ID */
  mid: string

  /** 状态注解 */
  annotations: string[]

  /** 被转发的数量 */
  reposts_count: number

  /** 评论数量 */
  comments_count: number
}

/**
 * Weibo 授权登录服务
 *
 * [Weibo开通应用](打开：https://open.weibo.com/)
 *
 * @param options
 * @returns
 */
export default function Weibo<P extends WeiboProfile>(
  options: OAuthUserConfig<P> & {} = {},
): OAuth2Config<P> {
  const {
    clientId = process.env.AUTH_WEIBO_ID!,
    clientSecret = process.env.AUTH_WEIBO_SECRET!,
    checks = ['state'],
    ...rest
  } = options

  return {
    id: 'Weibo',
    name: '微博登录',
    type: 'oauth',
    checks: checks as ['state'],
    style: { logo: '/providers/weibo.png', bg: '#fff', text: '#000' },
    clientId,
    clientSecret,
    authorization: {
      url: 'https://api.weibo.com/oauth2/authorize',
      params: {
        scope: 'email',
      },
    },
    userinfo: {
      url: 'https://api.weibo.com/2/users/show.json',
    },
    token: {
      url: 'https://api.weibo.com/oauth2/access_token',
      async conform(resp: Response) {
        const json = await resp.json()
        return Response.json({
          access_token: json.access_token,
          expires_in: json.expires_in,
        })
      },
    },
    profile: (profile) => {
      return {
        id: profile.id + '',
        name: profile.screen_name ?? profile.name,
        email: profile.id + '',
        image: profile.avatar_large,
      }
    },
    ...rest,
  } satisfies OAuth2Config<P>
}
