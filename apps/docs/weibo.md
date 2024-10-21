---
outline: deep
---

# 使用微博登录

> 支持微博登录

## 1. 注册微博开发者账号

## 2. 创建应用

## 3. 配置`next-auth`

```typescript
import NextAuth from 'next-auth'
import Weibo from '@next-auth-oauth/weibo'

export default NextAuth({
  providers: [Weibo],
})
```

## 3. 配置`Weibo`的环境变量,修改`.env`文件

```
AUTH_WEIBO_ID=APPID
AUTH_WEIBO_SECRET=
```
