import { OAuthUserConfig, OIDCConfig } from "next-auth/providers";

export interface AuthingProfile {
  /**
   * 订阅标识符
   */
  sub: string;

  /**
   * 受众标识符
   */
  aud: string;

  /**
   * 签发时间，UNIX时间戳
   */
  iat: number;

  /**
   * 过期时间，UNIX时间戳
   */
  exp: number;

  /**
   * 签发者 URL
   */
  iss: string;

  /**
   * 名字
   */
  name: string | null;

  /**
   * 名
   */
  given_name: string | null;

  /**
   * 中间名
   */
  middle_name: string | null;

  /**
   * 姓氏
   */
  family_name: string | null;

  /**
   * 昵称
   */
  nickname: string | null;

  /**
   * 首选用户名
   */
  preferred_username: string | null;

  /**
   * 个人资料 URL
   */
  profile: string | null;

  /**
   * 头像 URL
   */
  picture: string;

  /**
   * 个人网站 URL
   */
  website: string | null;

  /**
   * 出生日期
   */
  birthdate: string | null;

  /**
   * 性别
   */
  gender: string;

  /**
   * 时区信息
   */
  zoneinfo: string | null;

  /**
   * 语言区域
   */
  locale: string | null;

  /**
   * 更新日期和时间
   */
  updated_at: string;

  /**
   * 电子邮件地址
   */
  email: string | null;

  /**
   * 电子邮件是否已验证
   */
  email_verified: boolean;
}

/**
 * Authing 授权登录服务
 *
 * [Authing开通应用](打开：https://www.authing.cn/)
 *
 * @param options
 * @returns
 */
export default function Authing<P extends AuthingProfile>(
  options: OAuthUserConfig<P> & {
    /**
     * 查看应用-配置信息-认证配置-认证地址(点击复制)
     * @example https://demo.authing.cn/oidc/auth
     */
    domain?: string;
  } = {}
): OIDCConfig<P> {
  const {
    clientId = process.env.AUTH_AUTHING_ID!,
    clientSecret = process.env.AUTH_AUTHING_SECRET!,
    checks = ["state"],
    domain = process.env.AUTH_AUTHING_DOMAIN!,
    ...rest
  } = options;

  return {
    id: "authing", 
    name: "Authing",
    type: "oidc",
    style: { logo: "/providers/Authing.jpg", bg: "#fff", text: "#000" },
    checks: ["state"],
    clientId,
    clientSecret,
    idToken: true,
    issuer: domain + "/oidc", 
    jwks_endpoint: domain + "/oidc/.well-known/jwks.json",
    authorization:{
      params: {
        scope:"openid email username profile phone"
      }
    },
    wellKnown:
      domain + "/oidc/.well-known/openid-configuration",
    profile: (profile) => {
      return {
        id: profile.sub + "",
        name: profile.nickname??profile.sub,
        email: profile.email,
        image: profile.picture,
      };
    },
    ...rest,
  } satisfies OIDCConfig<P>;
}
