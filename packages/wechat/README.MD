## 微信公众号登录

### 使用示例：

```javascript
import { Wechat } from '@next-auth-oauth/wechat'
...
providers: [
  WeboAuthProvider({
    clientId: process.env.AUTH_WECHAT_APP_ID,
    clientSecret: process.env.AUTH_WECHAT_APP_SECRET
    // default platformType is 'OfficialAccount'
  })
]
```

## 微信网页登录

### 使用示例：

```javascript
import { Wechat } from '@next-auth-oauth/wechat'
...
providers: [
  WeboAuthProvider({
    clientId: process.env.AUTH_WECHAT_APP_ID,
    clientSecret: process.env.AUTH_WECHAT_APP_SECRET,
    platformType: process.env.AUTH_WECHAT_PLATFORM_TYPE //set platformType: WebsiteApp
  })
]
```
