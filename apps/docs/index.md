---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "🚀next-auth-oauth"
  text: "一键启动完善登录套件的Nextjs应用 🔐"
  image: "static/main.jpg"
  tagline: "为国人🚩提供更爽的集成，支持微信登国内常用平台，规范短信验证码集成"
  actions:
    - theme: brand
      text: 快速启动
      link: /quickstart
    - theme: alt
      text: Github访问
      link: https://github.com/liuhuapiaoyuan/next-auth-oauth

features:
  - title: 增强的 `signIn` 登录函数
    details: 自动处理绑定场景和登录验证，将验证逻辑转发给 `UserService` 🔄
  - title: 增加 Session
    details: 自动处理 `jwt`/`database` 下不同情况的 `user.id` 填充 🗃️
  - title: 多种授权操作
    details: 支持登录、登出、注册、解绑第三方账号等 🔑
  - title: 自定义绑定授权页面 UI
    details: 配置 `bindPage` 支持自定义授权绑定页面 🎨
  - title: 国产化第三方登录集成
    details: 支持 `微信公众号登录` 🐉、`微信网页登录` 🌐、`Gitee` 登录 📚
  - title: 微信公众关注登录
    details: 支持 `非认证公众号验证码登录`，`支持认证账号场景二维码`登录 
  - title: 支持QQ登录
    details:  支持 `QQ登录` 功能
  - title: 适配国产OIDC服务商
    details: 支持 `Authing`一键配置 📚
---



## 使用基本函数 🛠️

1. **实现 `IUserService` 接口**: 用于处理用户相关操作 👤
2. **配置授权适配器**: 根据需求设置授权适配器 🔧
3. **导出如下字段**:

   - **`signIn`**: 登录函数，增强后可以自动判断绑定场景/登录验证 🔑
   - **`signOut`**: 登出函数 🚪
   - **`auth`**: 授权函数 🛡️
   - **`listAccount`**: 获得绑定的第三方数据 📊
   - **`unBindOauthAccountInfo`**: 解绑第三方账号 🔓
   - **`handlers`**: 授权函数的中间件 ⚙️
   - **`regist`**: 账户注册函数 📝
   - **`oauthProviders`**: 列出第三方登录提供商 🌐
