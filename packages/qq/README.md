## QQ第三方登录示例

### 使用示例：

```javascript
import { QQ } from '@next-auth-oauth/qq'
...
providers: [
  QQ({
    clientId: process.env.AUTH_QQ_ID,
    clientSecret: process.env.AUTH_QQ_SECRET
  })
]
```
