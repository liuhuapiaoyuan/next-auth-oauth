# 使用飞书登录

> 网页应用登录是基于 OAuth 2.0 标准协议实现的，通过飞书账号授权登录第三方应用的能力。

## 1. 创建应用

先登录到飞书开放平台后台：[https://open.feishu.cn/app](https://open.feishu.cn/app)
然后创建企业网页应用

## 2. 配置网页登录回调

1. 点击应用进入应用配置，选择左侧的“安全设置”
2. 填写重定向地址： 'http://YOUR_NEXT_AUTH/api/auth/callback/feishu'
3. 本地调试可以用 `http://localhost:3000/api/auth/callback/feishu` 作为重定向地址

## 3. 配置 NextAuth.js

```typescript
import NextAuth from 'next-auth'
import { Feishu } from '@next-auth-oauth/feishu'

export default NextAuth({
  providers: [Feishu],
})
```

## 4. 配置环境变量

在 `.env` 文件中添加以下内容：

```
# 飞书登录
AUTH_FEISHU_ID=cli_a7acxxxxxxxxxxxx
AUTH_FEISHU_SECRET=O7YLGxxxxxxxxxxxxxxxx

```

## 5. 完成登录
