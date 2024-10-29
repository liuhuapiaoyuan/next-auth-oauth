import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  cacheDir: './.vitepress/.vite',
  srcDir: '.',
  base: '/next-auth-oauth/',
  title: '🚀next-auth-oauth,一键启动完善登录套件的Nextjs应用 🔐',
  lastUpdated: true,
  description: 'next-auth-oauth，一款符合中国国情的第三方登录集成方案',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '快速启动', link: '/quickstart' },
      { text: '在线Demo', link: 'https://next-auth.ggss.club' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Nextjs.Boy',
    },

    sidebar: [
      {
        text: '快速启动',
        items: [
          { text: '使用', link: '/quickstart' },
          { text: '应用案例', link: '/example' },
          { text: '微信公众号网页登录', link: '/wechat-mp-h5' },
          { text: '微信网页登录', link: '/wehcat-web' },
          { text: '公众号-验证码登录', link: '/wechatmp-captcha' },
          { text: '公众号-场景二维码登录', link: '/wechatmp-qrcode' },
          { text: 'Gitee登录', link: '/gitee' },
          { text: 'Authing登录', link: '/authing' },
          { text: 'Weibo登录', link: '/weibo' },
        ],
      },
      {
        text: '其他',
        items: [
          { text: 'Next.js 我该怎么爱你？', link: '/nextjs-fuck' },
          {
            text: '适合中国宝宝体质的第三方登录流程',
            link: '/chinese-third-party-login-flow',
          },
        ],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/liuhuapiaoyuan/next-auth-oauth',
      },
    ],
  },
})
