export type CaptchaManagerConfig = {
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

export interface CaptchaManager<T = { openid: string; unionid?: string }> {
  generate(code?: string): Promise<string>
  updateData(captcha: string, data: T): Promise<boolean>
  getData(captcha: string): Promise<T | undefined>
  list(): Promise<string[]>
}

export class MemoryCaptchaManager<
  T = {
    openid: string
    unionid?: string
  },
> implements CaptchaManager<T>
{
  private options: CaptchaManagerConfig
  private cache: Map<string, { data?: T; expireAt: number }> = new Map()

  constructor(options?: CaptchaManagerConfig) {
    this.options = options || {
      expireTime: 60000 * 2,
      length: 6,
    }
  }

  /**
   * 生成验证码
   */
  async generate(code?: string) {
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
  async updateData(captcha: string, data: T) {
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
  async getData(captcha: string) {
    const entry = this.cache.get(captcha)
    if (entry && entry.expireAt > Date.now()) {
      return entry.data
    }
  }

  /**
   * 清理过期的验证码
   */
  private async cleanupExpired() {
    const now = Date.now()
    for (const [captcha, entry] of this.cache.entries()) {
      if (entry.expireAt <= now) {
        this.cache.delete(captcha)
      }
    }
  }
  async list() {
    return Array.from(this.cache.keys())
  }
}
