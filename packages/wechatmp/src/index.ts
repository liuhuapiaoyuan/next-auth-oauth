import type {
  AccountCallback,
  AuthorizationEndpointHandler,
  OAuth2Config,
  OAuthUserConfig,
  TokenEndpointHandler,
  UserinfoEndpointHandler,
} from 'next-auth/providers'
import { WechatMpApi } from 'wechatmp-kit'
export type WechatPlatformConfig = {
  /**
   * 验证类型 "MESSAGE"|"QRCODE"
   * MESSAGE 回复消息
   * QRCODE 临时二维码
   * @default "MESSAGE"
   */
  type: 'MESSAGE' | 'QRCODE'
  /**
   * 认证账号必须提供
   * 提供二维码创建工具，
   */
  wechatMpApi: WechatMpApi

  /**
   * 二维码验证页面
   */
  qrcodePage?: string
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

type WechatMpResult<P extends WechatMpProfile> = {
  options?: OAuthUserConfig<P> & WechatPlatformConfig
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
): OAuth2Config<P> & WechatMpResult<P> {
  const { wechatMpApi } = options ?? {}

  const message = wechatMpApi.getMessageService('', '')

  //   跳转页面，也就是二维码
  const authorization: AuthorizationEndpointHandler = {
    url: 'http://localhost:3000/auth/qrcode',
    params: {
      appid: clientId,
      response_type: 'code',
      state: 'wechatmp',
    },
  }

  // 从callback中获得state,code 然后进一步获取
  const token: TokenEndpointHandler = () => {
    return {
      url: 'http://localhost:3000/wechatmp/token',
      async request({ code }: { code: string }) {
        // 通过code获取openid，并注销code
        return {
          access_token: 'access_token 从缓存中获得token',
        }
      },
    }
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

  return {
    account,
    id: 'wechatmp',
    name: '微信公众号关注登录',
    type: 'oauth',
    style: {
      logo: '/providers/wechatOfficialAccount.svg',
      bg: '#fff',
      text: '#000',
    },
    checks: ['none'],
    authorization,
    token,
    userinfo,
    profile,
  }
}
