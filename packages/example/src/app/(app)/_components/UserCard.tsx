import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export function UserCard() {
  return (
    <div className='w-full max-w-sm rounded-lg border border-slate-200 bg-white px-3 py-6 shadow dark:border-slate-700 dark:bg-slate-800'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-1 gap-2'>
          <div className='relative inline-flex'>
            <span className='absolute bottom-0 right-0 h-3 w-3 rounded-full border bg-green-600 dark:border-slate-900 dark:bg-green-600 dark:text-slate-100' />
            <Image
              src='/logo.png'
              alt='user'
              width={100}
              height={100}
              className='h-10 w-10 rounded-full border dark:border-slate-700'
            />
          </div>
          <div className='w-1 flex flex-1 flex-col gap-y-2'>
            <h3 className='text-sm font-bold text-slate-900 dark:text-slate-200'>
              John Doe
            </h3>
            <span className='text-xs text-slate-400'>johndoe@gmail.com</span>
          </div>
        </div>
        <span className='rounded-full bg-green-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-green-600'>
          Free
        </span>
      </div>
      <Link href='/pricing'>
        <Button
          className='mt-6 h-auto w-full border border-slate-300 p-3'
          variant='ghost'
        >
          ✨ Upgrade to Pro
        </Button>
      </Link>
    </div>
  )
}
