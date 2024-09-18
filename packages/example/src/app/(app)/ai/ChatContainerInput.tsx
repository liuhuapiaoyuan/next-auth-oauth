'use client'

import { Button } from '@/components/ui/button'
import { MicrochipIcon } from 'lucide-react'
import { submit } from './actions'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button className='  ' type='submit'>
      {pending ? '发送...' : '发送'}
    </Button>
  )
}

export function ChatContainerInput() {
  return (
    <form
      action={async () => {
        await submit()
        alert('提交成功')
      }}
    >
      <label htmlFor='chat-input' className='sr-only'>
        Enter your prompt
      </label>
      <div className='relative'>
        <Button
          variant='ghost'
          className='absolute group hover:bg-transparent top-0 bottom-0 px-2 h-auto '
        >
          <MicrochipIcon className='text-muted-foreground group-hover:text-foreground' />
        </Button>
        <textarea
          id='chat-input'
          className='block w-full resize-none rounded-xl border-none bg-slate-200 p-4 pl-10 pr-20 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-blue-500 sm:text-base'
          placeholder='Enter your prompt'
          rows={1}
          required
        />

        <div className='absolute group hover:bg-transparent top-0 bottom-0 right-0 px-2 h-auto  flex items-center'>
          <SubmitButton />
        </div>
      </div>
    </form>
  )
}
