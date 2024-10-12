---
outline: deep
---

# 使用微信公众号网页登录

## 1. 注册微信公众号

官方注册地址：[点击打开注册](https://mp.weixin.qq.com/)
或者使用[测试公众号申请](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)

## 2. 网页登录需要配置授权域名

登录微信公众号后台，找到`设置` -> `接口权限` -> `网页授权` -> `授权域名`

> 注意：正式版本授权域名需要 https且备案成功，测试版本授权域名无需备案，但需要在微信公众号后台设置`JS接口安全域名`

## 3. 配置`next-auth`

```typescript
import NextAuth from 'next-auth'
import { Wechat } from 'next-auth-oauth'

export default NextAuth({
  providers: [Wechat],
})
```

## 3. 配置`Wechat`的环境变量,修改`.env`文件

```
AUTH_WECHAT_APP_ID=your_app_id
AUTH_WECHAT_APP_SECRET=your_app_secret
AUTH_WECHAT_PLATFORM_TYPE=OfficialAccount # 公众号网页登录
```
