import type { AuthorizationEndpointHandler, OAuth2Config, OAuthUserConfig, TokenEndpointHandler, UserinfoEndpointHandler } from "next-auth/providers"

  
export type WechatMpProfile = {
  /**
   * 公众号扫码只能获得openid
   */
  openid: string
  unionid: string
}
export type WechatPlatformConfig = {
  clientId: string
clientSecret: string
}


/**
 * 微信公众号平台
 * [体验账号申请](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)
 * 
 * @param options 
 * @returns 
 */
export default function WeChatMp<P extends WechatMpProfile>(
  options: OAuthUserConfig<P> & WechatPlatformConfig 
): OAuth2Config<P> & { options: OAuthUserConfig<P> & WechatPlatformConfig  } {
  const {
    clientId = process.env.AUTH_WECHATMP_APP_ID!,
    clientSecret = process.env.AUTH_WECHATMP_APP_SECRET! 
  } = options ?? {}

  const authorization: AuthorizationEndpointHandler = {
    url: "/auth/qrcode",
    params: {
      appid: clientId,
      response_type: "code",
      state: Math.random(),
    },
  }

  const token: TokenEndpointHandler = {
    url: "ss",
    params: {
      appid: clientId,
      secret: clientSecret,
      code: "CODE",
      grant_type: "authorization_code",
    },
    conform: async (response: Response) => {
      const data = await response.json()
      response = new Response(
        JSON.stringify({
          ...data,
          token_type: "bearer",
        }),
        response
      )
      return response
    },
  }

  const userinfo: UserinfoEndpointHandler = {
    async request({ tokens, provider }: any) {
      return {
        openid:tokens.openid , 
        unionid:tokens.unionid
      }
    },
  }

  const profile = (profile: WechatMpProfile) => {
    const openid = profile.unionid ?? profile.openid
    return {
      id: openid,
      name: openid,
      email: openid + "@wechat.com",
      raw: profile,
    }
  }

  return {
    id: "wechatmap",
    name: "微信公众号",
    type: "oauth",
    style: { logo: "/providers/wechatmap.png", bg: "#fff", text: "#000" },
    checks: ["none"],
    clientId,
    clientSecret,
    authorization,
    token,
    userinfo,
    profile,
    options,
  }
}
