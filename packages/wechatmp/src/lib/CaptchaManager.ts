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
/**
 * CaptchaManager 接口定义了验证码管理的基本操作
 *
 * @template T - 与验证码关联的数据类型，默认为包含 openid 和可选 unionid 的对象
 */
export interface CaptchaManager<T = { openid: string; unionid?: string }> {
  /**
   * 生成一个新的验证码
   *
   * @param {string} [code] - 可选参数，如果提供，将使用此代码作为验证码
   * @returns {Promise<string>} 返回生成的验证码
   */
  generate(code?: string): Promise<string>

  /**
   * 更新与验证码关联的数据
   *
   * @param {string} captcha - 要更新的验证码
   * @param {T} data - 要与验证码关联的新数据
   * @returns {Promise<boolean>} 如果更新成功返回 true，否则返回 false
   */
  updateData(captcha: string, data: T): Promise<boolean>

  /**
   * 获取与验证码关联的数据
   *
   * @param {string} captcha - 要查询的验证码
   * @returns {Promise<T | undefined>} 返回与验证码关联的数据，如果验证码不存在或已过期则返回 undefined
   */
  getData(captcha: string): Promise<T | undefined>

  /**
   * 检查验证码是否存在
   *
   * @param {string} captcha - 要检查的验证码
   * @returns {Promise<boolean>} 如果验证码存在且未过期返回 true，否则返回 false
   */
  exists(captcha: string): Promise<boolean>

  /**
   * 列出所有当前有效的验证码
   *
   * @returns {Promise<string[]>} 返回一个包含所有有效验证码的数组
   */
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
  exists(captcha: string): Promise<boolean> {
    return Promise.resolve(this.cache.has(captcha))
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
