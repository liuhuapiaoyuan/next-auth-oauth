import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  cacheDir: './.vitepress/.vite' , 
  srcDir: '.',
  base:"/next-auth-oauth/",
  title: "🚀next-auth-oauth",
  lastUpdated: true ,
  description: "next-auth-oauth，一款符合中国国情的第三方登录集成方案",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '快速启动', link: '/quickstart' },
      { text: '文档', link: '/markdown-examples' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Nextjs.Boy'
    },

    sidebar: [
      {
        text: '快速启动',
        items: [
          { text: '使用', link: '/quickstart' },
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/liuhuapiaoyuan/next-auth-oauth' }
    ]
  }
})
