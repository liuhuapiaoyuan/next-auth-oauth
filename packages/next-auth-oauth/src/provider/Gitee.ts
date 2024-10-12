import type { OAuth2Config, OAuthUserConfig } from "next-auth/providers";

export interface GiteeProfile { 
     /** 用户头像 URL */
  avatar_url: string;
  /** 用户简介 */
  bio: string;
  /** 用户博客 URL */
  blog: string;
  /** 用户创建时间 */
  created_at: string;
  /** 用户邮箱 */
  email: string;
  /** 用户事件 URL */
  events_url: string;
  /** 用户粉丝数 */
  followers: Number;
  /** 用户粉丝 URL */
  followers_url: string;
  /** 用户关注数 */
  following: Number;
  /** 用户关注 URL */
  following_url: string;
  /** 用户 Gists URL */
  gists_url: string;
  /** 用户主页 URL */
  html_url: string;
  /** 用户 ID */
  id: Number;
  /** 用户登录名 */
  login: string;
  /** 用户角色 */
  member_role: string;
  /** 用户姓名 */
  name: string;
  /** 用户组织 URL */
  organizations_url: string;
  /** 用户公开 Gists 数量 */
  public_gists: Number;
  /** 用户公开仓库数量 */
  public_repos: Number;
  /** 用户收到事件 URL */
  received_events_url: string;
  /** 企业备注名 */
  remark: string;
  /** 用户仓库 URL */
  repos_url: string;
  /** 用户收藏数 */
  stared: Number;
  /** 用户收藏 URL */
  starred_url: string;
  /** 用户订阅 URL */
  subscriptions_url: string;
  /** 用户类型 */
  type: string;
  /** 用户更新时间 */
  updated_at: string;
  /** 用户 URL */
  url: string;
  /** 用户关注的项目数 */
  watched: Number;
  /** 用户微博 */
  weibo: string;
}

/**
 * Gitee 授权登录服务
 *
 * [Gitee开通应用](打开：https://gitee.com/oauth/applications/new)
 *
 * @param options
 * @returns
 */
export default function Gitee<P extends GiteeProfile>(
  options: OAuthUserConfig<P>  ={}
): OAuth2Config<P>   {
  const {
    clientId = process.env.AUTH_GITEE_ID!,
    clientSecret = process.env.AUTH_GITEE_SECRET!,
    checks=["pkce", "state"],
    ...rest
  } = options; 


  return {
    id: "gitee",
    name: "Gitee登录",
    type: "oauth",
    style: { logo: "/providers/gitee.jpg", bg: "#fff", text: "#000" },
    checks: ["pkce", "state"],
    clientId,
    clientSecret,
    authorization: {
      url: "https://gitee.com/oauth/authorize",
      params: {
        response_type: "code",
        scope:"user_info"
      }
    },
    userinfo: {
      url: "https://gitee.com/api/v5/user",
    },
    token: {
      url: "https://gitee.com/oauth/token",
      async conform(resp:Response){
        const {created_at:_,...json}  = await resp.json();
        return Response.json(json)
      }
    },
    profile: (profile) => {
      return {
        id: profile.id+"",
        name:profile.name,
        username:profile.name,
        email:profile.email,
        image:profile.avatar_url 
      }
    },
    ...rest,
  };
}
