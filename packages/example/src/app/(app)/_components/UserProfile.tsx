'use client'
import { PropsWithChildren } from 'react'
import Link from 'next/link'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserAvatar } from './UserAvatar'
export function UserProfile(props: PropsWithChildren<{}>) {
  const { children } = props
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <Link href='/profile'>
          <DropdownMenuLabel>
            <UserAvatar />
          </DropdownMenuLabel>
        </Link>
        <DropdownMenuSeparator />
        <Link href='/profile'>
          <DropdownMenuItem>设置</DropdownMenuItem>
        </Link>
        <Link href='/profile/security'>
          <DropdownMenuItem>安全</DropdownMenuItem>
        </Link>
        <DropdownMenuItem>支持</DropdownMenuItem>
        <DropdownMenuSeparator />
        <Link href='/'>
          <DropdownMenuItem>登出</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
