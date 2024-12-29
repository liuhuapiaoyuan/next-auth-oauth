# 🎉 微信公众号开发工具包 🛠️

一个基于TypeScript的微信公众号开发工具包，提供核心API接口和实用工具。

## 🚀 核心功能

- 🔑 **Access Token管理**
  - ✅ 自动获取和缓存Access Token
  - 🛠️ 支持自定义Token缓存实现
- 📨 **消息处理**
  - 📝 XML消息解析与生成
  - 📦 消息服务封装
- 👤 **用户管理**
  - 🛠️ 提供用户服务接口
- 🌐 **通用请求**
  - 📡 封装微信API请求

## 📦 安装

```bash
npm install wechatmp-kit
# 或者
yarn add wechatmp-kit
```

## ⚡ 快速开始

### 初始化

```typescript
import { WechatMpApi } from 'wechatmp-kit'

const wechatApi = new WechatMpApi({
  appId: '你的应用ID',
  appSecret: '你的应用密钥',
})
```

### 获取Access Token

```typescript
const token = await wechatApi.getAccessToken()
console.log('Access Token:', token)
```

### 处理消息

```typescript
const messageService = wechatApi.getMessageService('your-token')
const parsedMessage = messageService.parseXML(xmlMessage)
```

### 使用用户服务 👤

```typescript
const userService = wechatApi.userService

// 获取用户列表
const userList = await userService.userGet()

// 按标签获取用户
const taggedUsers = await userService.userTagGet(tagId)

// 获取所有标签
const tags = await userService.tagsGet()

// 发送模板消息
await userService.messageTemplateSend({
  touser: openId,
  template_id: 'TEMPLATE_ID',
  data: {
    key1: { value: '内容1' },
    key2: { value: '内容2' },
  },
})
```

## 📚 API 参考

### WechatMpApi

#### 构造函数

```typescript
new WechatMpApi(options: {
  appId: string
  appSecret: string
  tokenCache?: WehcatMpAccessTokenCacheManager
})
```

#### 主要方法

- `getAccessToken()`: 获取当前Access Token
- `getMessageService(token: string, encodingAESKey?: string)`: 获取消息处理服务
- `request<T>(options: RequestOptions)`: 发送微信API请求

### WehcatMpAccessTokenCacheManager

Token缓存管理接口，默认提供内存缓存实现。

#### 方法

- `get(appId: string)`: 获取缓存Token
- `set(appId: string, value: AccessTokenApiResult)`: 设置缓存Token

## 工具函数

- `parseWehcatMessageXML<T>(xml: string)`: 解析微信XML消息
- `renderXML(data: Record<string, string | number | object>)`: 生成XML消息

## 🤝 贡献指南

欢迎提交Pull Request。请确保代码风格一致并通过所有测试。

## 📜 许可证

本项目采用 MIT 许可证。
