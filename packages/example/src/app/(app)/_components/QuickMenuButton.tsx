'use client'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

import SearchButton from '@/components/ui/search-button'
import { AlertDialogTitle } from '@radix-ui/react-alert-dialog'
import Link from 'next/link'
import { useState } from 'react'
import { AppMenus } from './Menus'

export function QuickMenuButton() {
  const [show, setShow] = useState<boolean>(false)
  return (
    <>
      <AlertDialog open={show} onOpenChange={open => setShow(open)}>
        <AlertDialogTrigger asChild>
          <div>
            <SearchButton onShortcut={() => setShow(z => !z)} />
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className='p-0'>
          <AlertDialogDescription>
            <Command onBlurCapture={() => setShow(false)}>
              <CommandInput autoFocus placeholder='输入一个功能快捷启动' />
              <CommandList>
                <CommandEmpty>没有找到合适的操作.</CommandEmpty>
                <CommandGroup heading='建议操作'>
                  <CommandItem>Calendar</CommandItem>
                  {AppMenus.map(app => {
                    return (
                      <CommandItem
                        asChild
                        key={app.href}
                        onClick={() => setShow(false)}
                        keywords={app.keywords}
                      >
                        <Link href={app.href}>{app.title}</Link>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading='Settings'>
                  <CommandItem keywords={['profile', 'basic', '基本']}>
                    基本
                  </CommandItem>
                  <CommandItem keywords={['profile', 'security', '安全']}>
                    安全
                  </CommandItem>
                  <CommandItem keywords={['profile', 'integration', '集成']}>
                    集成
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
