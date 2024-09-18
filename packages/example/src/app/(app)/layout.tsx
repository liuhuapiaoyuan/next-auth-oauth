import type { PropsWithChildren } from 'react'
import { Header } from './_components/Header'
import { Slide } from './_components/Slide'
import { getMenus } from '@/service/menu.service'
export const description = 'SAAS工作台服务页面'

export default function AppLayout(props: PropsWithChildren) {
  const { children } = props
  const menus = getMenus()
  return (
    <div className='flex h-screen w-full '>
      <Slide
        menus={menus.map(z => ({
          title: z.title,
          href: z.href,
          keywords: z.keywords,
          icon: z.svg ? (
            <span
              dangerouslySetInnerHTML={{
                __html: z.svg,
              }}
            />
          ) : undefined,
        }))}
      />
      <div className='flex flex-1 w-1 relative  overflow-auto  flex-col '>
        <Header />
        <main className='grid  flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8'>
          {children}
        </main>
        <footer>
          <div className='flex justify-center items-center h-16'>
            <div className='text-center text-xs'>© 2022 NextAuth.js</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
