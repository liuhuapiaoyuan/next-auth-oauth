import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function SlideHeader() {
  return (
    <div className='flex  group-data-[slide-state=closed]:p-2 items-center justify-center flex-col p-4 [&>[data-slot=section]+[data-slot=section]]:mt-2.5'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex w-full p-2 h-auto gap-3'
            aria-haspopup='menu'
          >
            <Avatar className='h-9 w-9'>
              <AvatarImage src='/logo.png' alt='Avatar' />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>

            <div className='min-w-0  text-left flex-1 flex flex-col justify-start  group-data-[slide-state=closed]:sr-only'>
              <span className='block truncate text-sm/5 font-medium text-zinc-950 dark:text-white'>
                灵感笔记
              </span>
            </div>
            {/* <ChevronDown className='text-zinc-500 size-5  group-data-[slide-state=closed]:sr-only' /> */}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-[250px]'>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
