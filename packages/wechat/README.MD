## 微信公众号登录

### 使用示例：

```javascript
import { Weibo } from '@next-auth-oauth/wechat'
...
providers: [
  WeboAuthProvider({
    clientId: process.env.WEIBO_CLIENT_ID,
    clientSecret: process.env.WEIBO_CLIENT_SECRET
    // default platformType is 'OfficialAccount'
  })
]
```

## 微信网页登录

### 使用示例：

```javascript
import { Weibo } from '@next-auth-oauth/wechat'
...
providers: [
  WeboAuthProvider({
    clientId: process.env.WEIBO_CLIENT_ID,
    clientSecret: process.env.WEIBO_CLIENT_SECRET,
    platformType: process.env.AUTH_WECHAT_PLATFORM_TYPE //set platformType: WebsiteApp
  })
]
```

## TODO 未认证/已认证公众号，利用消息验证码登录

## TODO 已认证公众号，利用临时二维码登录
