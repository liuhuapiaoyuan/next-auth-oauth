'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { SlideHeader } from './SlideHeader'
import { SlideUserProfile } from './SlideUserProfile'
import { SlideMenuItem } from './SlideMenuItem'
import Link from 'next/link'
import { UserCard } from './UserCard'
import { Button } from '@/components/ui/button'

export function Slide(props: {
  menus: Array<{
    title: string
    href: string
    icon?: JSX.Element
    keywords?: string[]
  }>
}) {
  const { menus } = props
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()

  return (
    <aside
      data-slide-state={isOpen ? 'open' : 'closed'}
      className={cn(
        'relative',
        'inset-y-0 group left-0 transition-all z-10 hidden w-16 flex-col border-r bg-background sm:flex',
        isOpen && 'w-[260px]'
      )}
    >
      <nav className='flex-1'>
        <SlideHeader />
        <div
          className='flex
          gap-2
        group-data-[slide-state=closed]:gap-4
        group-data-[slide-state=closed]:p-2
        flex-1 flex-col overflow-y-auto p-4 [&>[data-slot=section]+[data-slot=section]]:mt-8'
        >
          {menus.map((menu, index) => (
            <SlideMenuItem
              key={index}
              href={menu.href}
              icon={menu.icon}
              label={menu.title}
              isOpen={isOpen}
              className={
                menu.href === pathname ? 'bg-accent text-accent-foreground' : ''
              }
            />
          ))}
        </div>
      </nav>
      {isOpen && (
        <div className='px-2 sm:py-2  '>
          <UserCard />
        </div>
      )}
      <div className='absolute right-0 translate-x-[50%] z-10 top-10'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className='flex  items-center justify-center w-10 h-10 p-0 rounded-full bg-white border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground  '
            >
              {isOpen ? (
                <PanelRightOpen className='h-5 w-5' />
              ) : (
                <PanelRightClose className='h-5 w-5' />
              )}
              <span className='sr-only'>设置</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side='right'>切换菜单</TooltipContent>
        </Tooltip>
        {/* <SlideUserProfile simple={!isOpen} /> */}
      </div>
    </aside>
  )
}
