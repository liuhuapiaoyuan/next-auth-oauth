---
outline: deep
---


# 使用微信开放平台网页登录


## 1. 注册微信开放平台

注册地址：[https://open.weixin.qq.com/](https://open.weixin.qq.com/)

## 2. 开通网页应用

1. 登录微信开放平台，点击“开发者中心”，选择“网站应用”，点击“创建应用”；
2. 填写“应用名称”、“应用URL”、“授权回调页面”等信息，点击“创建应用”；
3. 等待微信审核，审核通过后，点击“查看”按钮，可以看到“AppID”和“AppSecret”；

## 3. 配置 NextAuth.js

```typescript
import NextAuth from 'next-auth'
import {Wechat} from 'next-auth-oauth'

export default NextAuth({
    providers: [ Wechat],
})
```
## 4. 配置环境变量

在 `.env` 文件中添加以下内容：

```
WECHAT_ID=your_app_id
WECHAT_SECRET=your_app_secret
AUTH_WECHAT_PLATFORM_TYPE=WebsiteApp # 开放平台网页登录

```

