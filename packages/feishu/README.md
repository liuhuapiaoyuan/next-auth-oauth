## Gitee登录示例

### 使用示例：

```javascript
import { Gitee } from '@next-auth-oauth/gitee'
...
providers: [
  Gitee({
    clientId: process.env.AUTH_GITEE_ID,
    clientSecret: process.env.AUTH_GITEE_SECRET
  })
]
```
