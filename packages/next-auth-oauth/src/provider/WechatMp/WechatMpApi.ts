import crypto from "crypto";

type AccessTokenApiResult = {
  access_token: string;
  /**
     * 凭证有效时间，单位：秒

     */
  expires_in: number;
};
type QRCodeApiResult = {
  /**
   *  ticket	获取的二维码ticket，凭借此ticket可以在有效时间内换取二维码。
   */
  ticket: string;
  /**
   * 该二维码有效时间，以秒为单位。 最大不超过2592000（即30天）。
   */
  expire_seconds: number;
  /**
   * 二维码图片解析后的地址，开发者可根据该地址自行生成需要的二维码图片
   */
  url: string;
};
export interface WehcatMpAccessTokenCacheManager {
  get(appId: string): Promise<AccessTokenApiResult | undefined>;
  set(appId: string, value: AccessTokenApiResult): Promise<void>;
}

export class InMemoryWechatMpAccessTokenCacheManager
  implements WehcatMpAccessTokenCacheManager
{
  private cache: Map<
    string,
    { value: AccessTokenApiResult; expiresAt: number }
  > = new Map();

  async get(appId: string): Promise<AccessTokenApiResult | undefined> {
    const cached = this.cache.get(appId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }
    // 如果缓存过期或不存在，返回 undefined
    this.cache.delete(appId);
    return undefined;
  }

  async set(appId: string, value: AccessTokenApiResult): Promise<void> {
    const expiresAt = Date.now() + value.expires_in * 1000;
    this.cache.set(appId, { value, expiresAt });
  }
}

export function checkSignature(
  signature: string,
  timestamp: string,
  nonce: string,
  token: string
) {
  const tmpArr = [token, timestamp, nonce];
  tmpArr.sort();
  const tmpStr = tmpArr.join("");
  const hash = crypto.createHash("sha1").update(tmpStr).digest("hex");
  return hash === signature;
}
/**
 * 仅处理微信公众号消息的xml
 * @param xml
 * @returns
 */
export function parseWehcatMessageXML<T>(xml: string) {
  const result: Record<string, string> = {};
  // 匹配 XML 标签及其内容
  const regex = /<(\w+)>(.*?)<\/\1>/g;
  let match;

  while ((match = regex.exec(xml)) !== null) {
    const [, tag, content] = match;
    // 处理 CDATA
    const cleanContent = content.replace(/^<!\[CDATA\[|\]\]>$/g, "");
    result[tag] = cleanContent;
  }

  return result as T;
}

/**
 * 微信公众平台 API 调用工具
 * @see https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Access_Overview.html
 */
export class WechatMpApi {
  private appId: string;
  private appSecret: string;
  private accessTokenCacheManager: WehcatMpAccessTokenCacheManager;

  constructor(options?: {
    appId: string;
    appSecret: string;
    accessTokenCacheManager: WehcatMpAccessTokenCacheManager;
  }) {
    this.appId = options?.appId || process.env.AUTH_WECHATMP_APP_ID!;
    this.appSecret =
      options?.appSecret || process.env.AUTH_WECHATMP_APP_SECRET!;
    this.accessTokenCacheManager =
      options?.accessTokenCacheManager ||
      new InMemoryWechatMpAccessTokenCacheManager();
  }

  private async getAccessTokenFromBackend() {
    const body = {
      grant_type: "client_credential",
      appid: this.appId,
      secret: this.appSecret,
    };
    const url = "https://api.weixin.qq.com/cgi-bin/stable_token";
    const result = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
    if (result.errcode) {
      throw new Error(result.errmsg);
    }

    return result as AccessTokenApiResult;
  }

  async getAccessToken() {
    const cached = await this.accessTokenCacheManager.get(this.appId);
    if (cached) {
      return cached;
    }
    const accessToken = await this.getAccessTokenFromBackend();
    await this.accessTokenCacheManager.set(this.appId, accessToken);
    return accessToken;
  }

  async createPermanentQrcode(scene_str: string, expire_seconds: number = 300) {
    const accessToken = await this.getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${accessToken.access_token}`;
    const body = {
      expire_seconds,
      action_name: "QR_STR_SCENE",
      action_info: {
        scene: {
          scene_str,
        },
      },
    };
    const result = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
    if (result.errcode) {
      throw new Error(result.errmsg);
    }
    return result as QRCodeApiResult;
  }

  getPermanentQrcodeUrl(ticket: string) {
    return `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticket}`;
  }
}
