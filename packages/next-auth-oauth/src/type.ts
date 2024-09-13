 




import type { Account, NextAuthConfig, NextAuthResult } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { OAuthProviderButtonStyles } from "next-auth/providers";

type CallbacksType = NonNullable<NextAuthConfig["callbacks"]>;
export type CallbackSignInFunction = NonNullable<CallbacksType['signIn']>
export type CallbackSessionInFunction = NonNullable<CallbacksType["session"]>
export type CallbackJwtFunction = NonNullable<CallbacksType["jwt"]>

export { NextAuthConfig };

export type BindoAuthAccountInfo = {
  user: AdapterUser | null;
  bindAccount: boolean;
  account: Account | null;
};

export type NextAuthResultType = NextAuthResult & {
  
  oauthProviders: Array<{
    id: string;
    name: string;
    style:OAuthProviderButtonStyles
  }>;
  listAccount: () => Promise<
    Array<{
      type: string;
      id: string;
      provider: string;
      providerAccountId: string;
    }>
  >;
  regist: (formData: FormData) => Promise<any>;
  // user: null, bindAccount: false, account: null
  unBindOauthAccountInfo: () => Promise<BindoAuthAccountInfo>;

};

export interface DBAdapterUser extends Omit<AdapterUser, "email"> {
  /**
   * 邮箱
   */
  email?: string;
  /**
   *  手机
   */
  mobile?: string;
  /**
   * 账号名
   */
  username: string;
}

// 账号登录
export interface IUserService {
  /**
   * 实现登录
   * @param username  账号/邮箱/密码
   * @param password  密码/验证码
   * @param type  登录类型，可以是password或者mobile
   */
  login(
    username: string,
    password: string,
    type?: "password" | "mobile"
  ): Promise<DBAdapterUser>;
  /**
   * 注册账号
   * @param user
   */
  registUser(user: {
    username: string;
    password: string;
    /**
     * 表单提交的数据，比如：
     * @param nickname:string, //昵称
     * @param email:string, //邮箱
     * @param mobile:string, //手机
     */
    formData: Record<string, string>;
    /* 支持其他参数 */
  }): Promise<DBAdapterUser>;

  /**
   * 绑定的第三方授权信息
   * @param userId
   */
  listAccount(userId: string): Promise<
    Array<{
      type: string;
      id: string;
      provider: string;
      providerAccountId: string;
    }>
  >;
}
