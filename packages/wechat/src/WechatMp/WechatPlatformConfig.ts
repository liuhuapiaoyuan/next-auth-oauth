export type WechatMpCaptchaManagerConfig = {
  /**
   * 过期时间
   * @default 60000 (1min)
   */
  expireTime: number
  /**
   * 验证码长度
   * @default 6
   */
  length: number
}

export class WechatMpCaptchaManager<
  T = {
    openid: string
    unionid?: string
  },
> {
  private options: WechatMpCaptchaManagerConfig
  private cache: Map<string, { data?: T; expireAt: number }> = new Map()

  constructor(options?: WechatMpCaptchaManagerConfig) {
    this.options = options || {
      expireTime: 60000,
      length: 6,
    }
  }

  /**
   * 生成验证码
   */
  generate(code?: string): string {
    this.cleanupExpired()
    const captcha =
      code ??
      Math.random()
        .toString()
        .substring(2, this.options.length + 2)
    this.cache.set(captcha, { expireAt: Date.now() + this.options.expireTime })
    return captcha
  }

  /**
   * 更新验证码绑定的数据
   * @param captcha
   * @param data
   */
  complted(captcha: string, data: T) {
    if (this.cache.has(captcha)) {
      const entry = this.cache.get(captcha)
      if (entry && entry.expireAt > Date.now()) {
        entry.data = data
        return true
      }
    }
    return false
  }

  /**
   * 获取验证码绑定的数据
   * @param captcha
   */
  data(captcha: string) {
    console.log('获取验证码数据', {
      captcha,
      cache: JSON.stringify(this.cache),
    })
    const entry = this.cache.get(captcha)
    if (entry && entry.expireAt > Date.now()) {
      return entry.data
    }
  }
  /**
   * 校验验证码
   * @param captcha
   * @returns
   */
  async validCode(captcha: string): Promise<T | undefined> {
    const entry = this.cache.get(captcha)
    if (entry && entry.expireAt > Date.now()) {
      return entry.data
    }
    throw new Error('验证码不存在')
  }

  /**
   * 清理过期的验证码
   */
  private cleanupExpired(): void {
    const now = Date.now()
    for (const [captcha, entry] of this.cache.entries()) {
      if (entry.expireAt <= now) {
        this.cache.delete(captcha)
      }
    }
  }
}
