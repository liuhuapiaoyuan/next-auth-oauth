import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const UserAvatar = (props: ButtonProps & { simple?: boolean }) => {
  const { simple, className, ...buttonProps } = props
  return (
    <>
      <Button
        variant='ghost'
        className={cn('flex  gap-3', className)}
        aria-haspopup='menu'
        {...buttonProps}
      >
        <Avatar className='h-9 w-9'>
          <AvatarImage
            src='https://catalyst-demo.tailwindui.com/users/erica.jpg'
            alt='Avatar'
          />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>

        <div className='min-w-0  text-left flex-1 flex flex-col '>
          <span className='block truncate text-sm/5 font-medium text-zinc-950 dark:text-white'>
            Erica
          </span>
          <span className='block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400'>
            erica@example.com
          </span>
        </div>
      </Button>
    </>
  )
}

export { UserAvatar }
