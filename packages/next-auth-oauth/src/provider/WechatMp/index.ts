import {
  AuthorizationEndpointHandler,
  OAuth2Config,
  OAuthUserConfig,
  UserinfoEndpointHandler,
} from "next-auth/providers";
import { NextRequest } from "next/server";
import { checkSignature, parseWehcatMessageXML, WechatMpApi } from "./WechatMpApi";
import { WechatMpCaptchaManager } from "./WechatPlatformConfig";


const globalForPrisma = globalThis as unknown as {wechatMpCaptchaManager:WechatMpCaptchaManager}
 
export const wechatMpCaptchaManager = globalForPrisma.wechatMpCaptchaManager || new WechatMpCaptchaManager()
 
if (process.env.NODE_ENV !== "production") globalForPrisma.wechatMpCaptchaManager = wechatMpCaptchaManager


export type WechatPlatformConfig = {
  clientId?: string;
  clientSecret?: string;
  /* 解密密钥*/
  encoderAESKey?: string;
  /* 消息令牌 */
  token?: string;
  /**
   * 验证类型 "MESSAGE"|"QRCODE"
   * MESSAGE 回复消息
   * QRCODE 临时二维码
   * @default "MESSAGE"
   */
  type:"MESSAGE"|"QRCODE"
  /**
   * 认证账号必须提供
   * 提供二维码创建工具，
   */
  wechatMpApi?:WechatMpApi
};

export type WechatMpProfile = {
  /**
   * 公众号扫码只能获得openid
   */
  openid: string;
  unionid: string;
};


/**
 * 处理Nextjs的GET/POST请求
 */
async function handler(req: NextRequest, token: string) {
  const searchParams = req.nextUrl.searchParams;
  const signature = searchParams.get("signature");
  const echostr = searchParams.get("echostr");
  const timestamp = searchParams.get("timestamp");
  const nonce = searchParams.get("nonce");
  if (req.method == "GET" ) {
    if (
      signature &&
      echostr &&
      timestamp &&
      nonce &&
      checkSignature(signature, timestamp, nonce, token)
    ) {
      return new Response(echostr, { status: 200 });
    }
    return new Response("Invalid signature", { status: 401 });
  }
  // 判断消息类型 如果是表单类型
  const isFormData = req.headers.get("Content-Type")?.includes("form")
  if (isFormData) {
    const formData = await req.formData();
    const code = formData.get("code");
    const data = await wechatMpCaptchaManager.data(code?.toString()!);
    if(!data){
      return new Response("Invalid state", { status: 401 });
    }
    return Response.json({
      scope:"openid",
      access_token: data.openid,
      token_type: "bearer",
    });
  } else {
    if (
      !(
        signature &&
        timestamp &&
        nonce &&
        checkSignature(signature, timestamp, nonce, token)
      )
    ) {
      return new Response("Invalid signature", { status: 401 });
    }
    const xml = await req.text();
    // 文本消息
    const message = parseWehcatMessageXML<{
      FromUserName: string;
      ToUserName: string;
      MsgType: string;
      Content: string;
      MsgId: string;
      EventKey?:string
    }>(xml);
    // 如果有 Ticket 优先使用 Ticket 验证
    const code =  message.EventKey ?? message.Content
    const status = await wechatMpCaptchaManager.complted(code,{
      openid: message.FromUserName
    })
    return new Response(
      `<xml>
  <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
  <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
  <CreateTime>${Math.floor(Date.now()/1000)}</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[${status?"登录成功":"登录失败,请重新获得验证码"}]]></Content>
</xml>
`,
      { status: 200, headers:{"Content-Type": "text/xml"} }
    );
  }
}

/**
 * 微信公众号平台
 * [体验账号申请](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)
 *
 * @param options
 * @returns
 */
export default function WeChatMp<P extends WechatMpProfile>(
  options?: OAuthUserConfig<P> & WechatPlatformConfig
): OAuth2Config<P> & { 
  handler:{
    GET: (req:NextRequest)=>Promise<Response>,
    POST: (req:NextRequest)=>Promise<Response> , 
  }
  getScanUrl:()=>Promise<{
    qrcode:string,
    type:"MESSAGE"|"QRCODE",
    ticket:string
  }>
  options?: OAuthUserConfig<P> & WechatPlatformConfig } {
  const {
    clientId = process.env.AUTH_WECHATMP_APP_ID!,
    clientSecret = process.env.AUTH_WECHATMP_APP_SECRET!,
    encoderAESKey = process.env.AUTH_WECHATMP_ENCODER_AESKEY,
    token = process.env.AUTH_WECHATMP_TOKEN!,
    type = process.env.AUTH_WECHATMP_TYPE ?? "MESSAGE",
    wechatMpApi,
    // 令牌 开发者ID，开发者密码，消息加解密密钥
  } = options ?? {};
  if (!clientId || !clientSecret || !token ) {
    throw new Error("WechatMp platform requires client_id, client_secret, token");
  }
  if(type === "QRCODE" && typeof wechatMpApi === 'undefined'){
    throw new Error("WechatMpApi is required for QRCODE type")
  }
   

  const authorization: AuthorizationEndpointHandler = {
    url: "http://localhost:3000/auth/qrcode",
    params: {
      appid: clientId,
      response_type: "code",
      state:"wechatmp"
    },
  };

  const userinfo: UserinfoEndpointHandler = {
    url: "http://localhost:3000/auth/qrcode2",
    async request({ tokens }: any) {
      return {
        openid: tokens.access_token,
      };
    },
  };

  const profile = (profile: WechatMpProfile) => {
    const openid = profile.unionid ?? profile.openid;
    return {
      id: openid,
      name: openid,
      email: openid + "@wechat.com",
      raw: profile,
    };
  };

  return {
    id: "wechatmp",
    name: "微信公众号关注",
    type: "oauth",
    style: { logo: "/providers/wechatOfficialAccount.svg", bg: "#fff", text: "#000" },
    checks: ["none"],
    clientId,
    clientSecret,
    authorization,
    token: {
      url: "http://localhost:3000/api/auth/wechatmp",
    },
    userinfo,
    profile,
    handler:{
      GET:(req:NextRequest)=>handler(req,token),
      POST:(req:NextRequest)=>handler(req,token)  
    },
    async getScanUrl(){
      const code = await wechatMpCaptchaManager.generate()
      if(type === "QRCODE" && wechatMpApi){
        const {  url } = await wechatMpApi.createPermanentQrcode(code)
        return {
          qrcode: url,
          ticket:code,
          type : "QRCODE"
        }
      }else{
        return {
          qrcode: "https://cdn.kedao.ggss.club/picgo0",
          ticket: code,
          type : "MESSAGE"
        }
      }
    }
  };
}
