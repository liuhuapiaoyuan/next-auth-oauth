// 账号注册

import NextAuth, {
  Account,
  CredentialsSignin
} from "next-auth";
import { Adapter, AdapterUser } from "next-auth/adapters";
import credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { BindoAuthAccountInfo, CallbackSessionInFunction, CallbackSignInFunction, IUserService, NextAuthConfig, NextAuthResultType } from "./type";
function cleanBindAccountInfo() {
  const cookie = cookies();
  cookie.delete("nextauth.bind.account");
  cookie.delete("nextauth.bind.user");
}
/**
 * 从cookie获得绑定账号信息
 * @returns
 */
export async function loadBindAccountInfo() :Promise<BindoAuthAccountInfo>{
  const cookie = cookies();
  try {
    const account = JSON.parse(
      cookie.get("nextauth.bind.account")?.value ?? "null"
    ) as Account | null;
    const user = JSON.parse(
      cookie.get("nextauth.bind.user")?.value ?? "null"
    ) as AdapterUser | null;
    const bindAccount = !!(account && user);
    return { user, bindAccount, account };
  } catch (error) {
    return { user: null, bindAccount: false, account: null };
  }
}




export class CredentialsOauth {
  private userService: IUserService;
  private authAdapter: Adapter;
  private bindPage:string
  constructor(userService: IUserService, nextAuthAdapter: Adapter,bindPage:string="/auth/bind") {
    this.userService = userService;
    this.authAdapter = nextAuthAdapter;
    this.bindPage = bindPage
  }
  /**
   * 构建账号密码登录的provider
   * @param options
   * @returns
   */
  getCredentialsProvider() {
    return credentials({
      credentials: {
        username: {},
        password: {},
        type: {},
      },
      authorize: async (credentials) => {
        if (
          typeof credentials.username === "string" &&
          typeof credentials.password === "string"  
        ) {
          const { bindAccount, account } = await loadBindAccountInfo();
          const user = await this.userService.login(
            credentials.username,
            credentials.password,
            (credentials.type ?? "password") as "password" | "mobile"
          );
          if (user && bindAccount && account) {
            await this.authAdapter.linkAccount?.({
              ...account,
              userId: user.id,
              type: "oauth",
            });
            cleanBindAccountInfo();
          }
          return user;
        }
        throw new CredentialsSignin("账号或者密码错误");
      },
    });
  }
  
  
  private async signInCallback(params: Parameters<CallbackSignInFunction>[0]) {
    const { user, account, profile } = params;
    if (account?.type !== "oauth") {
      return true;
    }
    if (account) {
      const databseUser = await this.authAdapter.getUserByAccount?.({
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      });
      if (account && databseUser) {
        return true;
      }
    }
    const cookie = cookies();
    cookie.set("nextauth.bind.account", JSON.stringify(account));
    cookie.set("nextauth.bind.user", JSON.stringify(user));
    return this.bindPage;
  }
  private async sessionCallback(params:Parameters<CallbackSessionInFunction>[0]) {
    const { session, token, user } = params;
    const newSession = {
      ...session,
      user: {
        ...session.user,
        name: token.name?? user?.name,
        id: user?.id ?? token?.sub,
      },
    }
    return newSession
  }
  

  /**
   *
   * @param config
   * @returns
   */
  public nextAuth(config: NextAuthConfig):NextAuthResultType {
    const nextAuthInstance = NextAuth({
      ...config,
      providers: (config.providers ?? []).concat(this.getCredentialsProvider()),
      callbacks: {
        signIn: async (params) => {
            const reuslt = await this.signInCallback(params)
            if (reuslt === true && typeof config.callbacks?.signIn==='function') {
                return config.callbacks?.signIn(params)
            }
            return reuslt
        },
        session: async (params)=>{
          let session  =await this.sessionCallback(params)
          if (typeof config.callbacks?.session==='function') {
            return  config.callbacks?.session({...params, session})
          }
          return session
        },

      },
    });
     const oauthProviders = config.providers?.map((provider) => {
    if (typeof provider === "function") {
      provider = provider();
    }
    return { id: provider.id, name: provider.name };
  })
  .filter((provider) => provider.id !== "credentials");
    /**
     * 账号注册,并自动绑定
     * 注意这是一个ServerAction
     * @param formData
     */
    const regist = async (formData: FormData) => {
      const { user, bindAccount, account } = await loadBindAccountInfo();
      // 获得账号密码
      const { username, password, redirectTo, ...formUser } =
        Object.fromEntries(formData);
      // 创建账号
      const adapterUser = await this.userService.registUser({
        username: username.toString(),
        password: password.toString(),
        formData: formUser as { [key: string]: string },
      });
      if (bindAccount && account && user && adapterUser) {
        await this.authAdapter.linkAccount?.({
          ...account,
          userId: adapterUser.id,
          type: "oauth",
        });
        cleanBindAccountInfo();
        return nextAuthInstance.signIn("credentials", {
          username,
          password,
          redirectTo: redirectTo?.toString(),
        });
      }
    };
    /**
     * 列出绑定的授权账户列表
     * @returns 
     */
    const listAccount = async()=>{
      const session = await nextAuthInstance.auth()
      const userId = session?.user?.id
      if (userId) {
        return this.userService.listAccount(userId)
      }
      return []
    }

    return { 
        ...nextAuthInstance  ,
        oauthProviders,  
        listAccount,
        regist , 
        /**
         * 未绑定的临时账户信息
         */
        unBindOauthAccountInfo:loadBindAccountInfo

     };
  }
}


/**
 * 封装好的支持授权绑定的服务
 * 1. 分装好regist注册`ServerAction`
 * 2. 封装好`Credentials`的认证逻辑
 * 3. 分装好`OauthCallcak`的逻辑,自动判断账号有效性
 * @param config
 * @returns
 */
export function AdavanceNextAuth(
  config: NextAuthConfig & {
    /**
     * 第三方账号首次登录绑定页面
     */
    bindPage?:string
    /**
     * 配置用户数据库服务
     */
    userService: IUserService;
    adapter: Adapter;
  }
) {
  const {bindPage,   userService, pages , ...nextAuthConfig } = config;
  const credentialsProvider = new CredentialsOauth(
    userService,
    config.adapter   , 
    bindPage
  );

  return credentialsProvider.nextAuth(nextAuthConfig);
}
