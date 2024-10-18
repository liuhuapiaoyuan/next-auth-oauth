## 微博授权登录

### 使用示例：

```javascript
import { Weibo } from '@next-auth-oauth/weibo'
...
providers: [
  WeboAuthProvider({
    clientId: process.env.WEIBO_CLIENT_ID,
    clientSecret: process.env.WEIBO_CLIENT_SECRET
  })
]
```
