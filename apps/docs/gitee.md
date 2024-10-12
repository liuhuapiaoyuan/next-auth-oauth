---
outline: deep
---

# 使用Gitee登录

## 1. 注册`Gitee`开发者账号，并创建应用

打开：(创建应用https://gitee.com/oauth/applications/new)[https://gitee.com/oauth/applications/new]
完成登录，并创建应用，这边应用回调地址和Github一样，填写`http://localhost:3000/api/auth/callback/gitee`

## 2. 调整`auth.ts`的`Provider`配置

```typescript
import { Gitee } from 'next-auth-oauth/Gitee'
const providers = [Gitee]
```

## 3. 配置`Gitee`的环境变量,修改`.env`文件

```
GITEE_ID=your_client_id
GITEE_SECRET=your_client_secret
```
