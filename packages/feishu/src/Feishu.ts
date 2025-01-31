import type { OAuth2Config, OAuthUserConfig } from 'next-auth/providers'

export interface FeishuProfile {
  /** 用户在应用内的唯一标识 */
  user_id: string
  /** 用户的union id */
  union_id: string
  /** 用户的open id */
  open_id: string
  /** 用户姓名 */
  name: string
  /** 用户英文名称 */
  en_name: string
  /** 用户头像 URL */
  avatar_url: string
  /** 用户头像 72x72 URL */
  avatar_thumb: string
  /** 用户头像 240x240 URL */
  avatar_middle: string
  /** 用户头像 640x640 URL */
  avatar_big: string
  /** 用户邮箱 */
  email: string
  /** 企业邮箱 */
  enterprise_email: string
  /** 用户手机号 */
  mobile: string
  /** 用户工号 */
  employee_no: string
  /** 租户的唯一标识 */
  tenant_key: string
}

/**
 * 飞书 授权登录服务
 *
 * [飞书开通应用](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/authen-v1/login-overview)
 *
 * @param options
 * @returns
 */
export function Feishu<P extends FeishuProfile>(
  options: OAuthUserConfig<P> = {},
): OAuth2Config<P> {
  const {
    clientId = process.env.AUTH_FEISHU_ID!,
    clientSecret = process.env.AUTH_FEISHU_SECRET!,
    checks = ['pkce', 'state'],
    ...rest
  } = options

  return {
    id: 'Feishu',
    name: '飞书',
    type: 'oauth',
    style: {
      logo: '/providers/Feishu.jpg',
      brandColor: '#c71d23',
      text: '#fff',
    },
    checks: checks as ['pkce'],
    clientId,
    clientSecret,
    authorization: {
      url: 'https://accounts.feishu.cn/open-apis/authen/v1/authorize',
      params: {
        response_type: 'code' 
      },
    },
    userinfo: {
      url: 'https://open.feishu.cn/open-apis/authen/v1/user_info',
      request: {
        headers: {
          Authorization: 'Bearer {access_token}',
        },
      },
    },
    token: {
      url: 'https://open.feishu.cn/open-apis/authen/v2/oauth/token'
    },
    profile: (profile) => {
      return {
        id: profile.user_id,
        name: profile.name ?? profile.en_name,
        username: profile.name ?? profile.en_name,
        email: profile.enterprise_email ?? profile.email,
        image: profile.avatar_url ?? profile.avatar_big ?? profile.avatar_middle ?? profile.avatar_thumb,
      }
    },
    ...rest,
  }
}
