import type { AccessTokenApiResult } from './type'

export interface WehcatMpAccessTokenCacheManager {
  get(appId: string): Promise<AccessTokenApiResult | undefined>
  set(appId: string, value: AccessTokenApiResult): Promise<void>
}

/**
 * 基于内存的Token管理机制
 */
export class InMemoryWechatMpAccessTokenCacheManager
  implements WehcatMpAccessTokenCacheManager
{
  private cache: Map<
    string,
    { value: AccessTokenApiResult; expiresAt: number }
  > = new Map()

  async get(appId: string): Promise<AccessTokenApiResult | undefined> {
    const cached = this.cache.get(appId)
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value
    }
    // 如果缓存过期或不存在，返回 undefined
    this.cache.delete(appId)
    return undefined
  }

  async set(appId: string, value: AccessTokenApiResult): Promise<void> {
    const expiresAt = Date.now() + value.expires_in * 1000
    this.cache.set(appId, { value, expiresAt })
  }
}
