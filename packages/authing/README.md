## Gitee登录示例

### 使用示例：

```javascript
import { Authing } from '@next-auth-oauth/authing'
...
providers: [
  Authing({
    clientId: process.env.AUTH_AUTHING_ID,
    clientSecret: process.env.AUTH_AUTHING_SECRET
    domain: process.env.AUTH_AUTHING_DOMAIN
  })
]
```
