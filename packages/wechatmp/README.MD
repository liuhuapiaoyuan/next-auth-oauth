## 微信公众号授权登录

## 案例代码：

#### 1. 配置环境变量

```bash
# 微信appid
AUTH_WECHATMP_APPID=
# 微信appsecret
AUTH_WECHATMP_APPSECRET=
# 微信回调callback地址
AUTH_WECHATMP_TOKEN=
# 微信公众号校验类型（QRCODE 认证服务号可用| MESSAGE 任何号可用）
AUTH_WECHATMP_CHECKTYPE=
# 微信公众号消息加解密密钥
AUTH_WECHATMP_AESKEY=
# 微信公众号回调CALLBACK地址
AUTH_WECHATMP_ENDPOINT=
# 微信公众号二维码图片地址(MESSAGE模式必须填写)
AUTH_WECHATMP_QRCODE_IMAGE_URL=

```

### 2. 实例化并配置到`auth.ts`文件中

```typescript
import Wehcatmp from '@next-auth-oauth/wechatmp'

export const wechatMpProvder = Wehcatmp({})
```

```typescript
  providers: [Gitee, Github, wechatMpProvder],

```

#### 3. 配合 `AUTH_WECHATMP_ENDPOINT` 创建回调路由

比如你配置 `AUTH_WECHATMP_ENDPOINT='http://localhost:3000/api/auth/wechatmp'`

那么你需要在你的项目中创建路由 `/api/auth/wechatmp/route.ts` 用来接收微信公众号的回调数据。

```typescript
import { wechatMpProvder } from '@/auth'
export const { GET, POST } = wechatMpProvder
```

#### 4. 配置微信公众号授权登录

将TOKEN/AES/AUTH_WECHATMP_ENDPOINT 填写到微信公众号后台上

## 更新日志
