import { CaptchaManager, MemoryCaptchaManager } from '@next-auth-oauth/wechatmp'
import { Redis } from '@upstash/redis'

// const redis = new Redis({
//   url: process.env.KV_REST_API_URL,
//   token: process.env.KV_REST_API_TOKEN,
// })

export type CaptchaManagerConfig = {
  /**
   * 过期时间*（ms）
   * @default 60000 (1min)
   */
  expireTime: number
  /**
   * 验证码长度
   * @default 6
   */
  length: number
}

/**
 * 实现一个基于redis的验证码管理器
 */
export class RedisCaptchaService implements CaptchaManager {
  redis: Redis
  options: CaptchaManagerConfig
  constructor(redis: Redis, config?: CaptchaManagerConfig) {
    this.options = config ?? {
      expireTime: 60000 * 2,
      length: 6,
    }
    this.redis = redis
  }
  generate(code?: string): Promise<string> {
    code ??= Math.random()
      .toString()
      .substring(2, this.options.length + 2)
    return this.redis
      .set(
        `captcha:${code}`,
        {},
        {
          ex: this.options.expireTime / 1000,
        },
      )
      .then((r) => {
        if (r == 'OK') {
          return code
        }
        throw new Error('Failed to generate captcha')
      })
  }
  async updateData(
    captcha: string,
    data: { openid: string; unionid?: string },
  ) {
    const codeData = await this.redis.get(`captcha:${captcha}`)
    if (codeData) {
      await this.redis.set(
        `captcha:${captcha}`,
        { openid: data.openid, unionid: data.unionid },
        {
          ex: this.options.expireTime / 1000,
        },
      )
      return true
    }
    return false
  }
  getData(captcha: string) {
    return this.redis
      .get<{
        openid: string
        unionid?: string
      }>(`captcha:${captcha}`)
      .then((data) => {
        if (data) {
          return data
        }
        return undefined
      })
  }
  list(): Promise<string[]> {
    return this.redis.keys('captcha:*')
  }
}

export const captchaManager = process.env.KV_REST_API_URL
  ? new RedisCaptchaService(
      new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      }),
      {
        expireTime: 60000 * 2,
        length: 6,
      },
    )
  : new MemoryCaptchaManager()
