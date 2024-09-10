import { AuthError } from "next-auth"
import { AuthorizationEndpointHandler, OAuth2Config, OAuthUserConfig, TokenEndpointHandler, UserinfoEndpointHandler } from "next-auth/providers"


type WechatPlatform = {
  platformType?: "OfficialAccount" | "WebsiteApp"
}

const WEHCAT_PLATFORM_AuthorizationEndpointUrl = {
  OfficialAccount: "https://open.weixin.qq.com/connect/oauth2/authorize",
  WebsiteApp: "https://open.weixin.qq.com/connect/qrconnect",
}

const Wehcat_TokenEndpointUrl = "https://api.weixin.qq.com/sns/oauth2/access_token"

export interface WeChatProfile {
  /** 用户在公众号下的唯一标识 */
  openid: string
  /** 用户昵称 */
  nickname: string
  /** 用户的性别，值为1时是男性，值为2时是女性，值为0时是未知 */
  sex: number
  /** 用户个人资料填写的省份 */
  province: string
  /** 普通用户个人资料填写的城市 */
  city: string
  /** 国家，如中国为CN */
  country: string
  /** 用户头像链接 */
  headimgurl: string
  /** 用户特权信息，json 数组，如微信沃卡用户为（chinaunicom） */
  privilege: string[]
  /** 可通过该字段进行用户信息的整合 */
  unionid: string
  /** 其他用户信息字段 */
  [claim: string]: unknown
}



const Wechat_UserinfoEndPoint = "https://api.weixin.qq.com/sns/userinfo"
/**
 * 微信公众号/微信网页应用 授权登录服务
 * 
 * [体验账号申请](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)
 * 
 * @param options 
 * @returns 
 */
export default function WeChat<P extends WeChatProfile>(
  options: OAuthUserConfig<P> & WechatPlatform
): OAuth2Config<P> & { options: OAuthUserConfig<P> & WechatPlatform } {
  const {
    clientId = process.env.AUTH_WECHAT_APP_ID!,
    clientSecret = process.env.AUTH_WECHAT_APP_SECRET!,
    platformType = process.env.AUTH_WECHAT_PLATFORM_TYPE ?? "OfficialAccount",
  } = options ?? {}

  if (platformType !== "OfficialAccount" && platformType !== "WebsiteApp") {
    throw new AuthError("Invalid WehcatPlatformType")
  }

  const authorizationEndpointUrl = WEHCAT_PLATFORM_AuthorizationEndpointUrl[platformType]
  const authorizationScope = platformType === "OfficialAccount" ? "snsapi_userinfo" : "snsapi_login"

  const authorization: AuthorizationEndpointHandler = {
    url: authorizationEndpointUrl,
    params: {
      appid: clientId,
      response_type: "code",
      scope: authorizationScope,
      state: Math.random(),
    },
  }

  const token: TokenEndpointHandler = {
    url: Wehcat_TokenEndpointUrl,
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
    url: Wechat_UserinfoEndPoint,
    // 由于微信不是标准的 OAuth2 协议，所以需要手动设置 access_token 和 openid 参数
    async request({ tokens, provider }: any) {
      const url = new URL(provider.userinfo?.url!)
      url.searchParams.set("access_token", tokens.access_token!)
      url.searchParams.set("openid", String(tokens.openid))
      url.searchParams.set("lang", "zh_CN")
      const response = await fetch(url)
      return response.json()
    },
  }

  const profile = (profile: WeChatProfile) => {
    const openid = profile.unionid ?? profile.openid
    return {
      id: openid,
      name: profile.nickname,
      email: openid + "@wechat.com",
      image: profile.headimgurl,
      raw: profile,
    }
  }

  return {
    id: "wechat",
    name: "微信",
    type: "oauth",
    style: { logo: "/providers/wechat.png", bg: "#fff", text: "#000" },
    checks: ["pkce", "state"],
    clientId,
    clientSecret,
    authorization,
    token,
    userinfo,
    profile,
    options,
  }
}
