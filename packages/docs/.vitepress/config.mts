import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  cacheDir: './.vitepress/.vite' , 
  srcDir: '.',
  title: "🚀next-auth-oauth",
  description: "next-auth-oauth，一款符合中国国情的第三方登录集成方案",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '快速启动', link: '/quickstart' },
      { text: '文档', link: '/markdown-examples' }
    ],

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
