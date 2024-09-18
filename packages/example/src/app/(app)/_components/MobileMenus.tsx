import { Package2 } from 'lucide-react'
import Link from 'next/link'
import { AppMenus } from './Menus'

export function MobileMenus() {
  return (
    <nav className='grid gap-6 text-lg font-medium'>
      <Link
        href='#'
        className='group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base'
      >
        <Package2 className='h-5 w-5 transition-all group-hover:scale-110' />
        <span className='sr-only'>Acme Inc</span>
      </Link>

      {AppMenus.map((menu, index) => {
        return (
          <Link
            key={index}
            href={menu.href}
            className='hover:bg-accent hover:text-accent-foreground'
          >
            {menu.title}
          </Link>
        )
      })}
    </nav>
  )
}
