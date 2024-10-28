## 微博授权登录

### 使用示例：

```javascript
import { Weibo } from '@next-auth-oauth/weibo'
...
providers: [
  Weibo({
    clientId: process.env.AUTH_WEIBO_ID,
    clientSecret: process.env.AUTH_WEIBO_SECRET
  })
]
```
