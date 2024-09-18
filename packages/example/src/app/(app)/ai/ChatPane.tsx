import { Plus, TextSearch } from 'lucide-react'

export function ChatPane() {
  return (
    <div className='max-w-xl h-full flex flex-col rounded-lg border border-slate-300  py-8 dark:border-slate-200/10 dark:bg-slate-900'>
      <div className='flex items-start'>
        <h2 className='inline px-5 text-lg font-medium text-slate-800 dark:text-slate-200'>
          对话
        </h2>
        <span className='rounded-full bg-primary px-2 py-1 text-xs text-slate-200'>
          24
        </span>
      </div>
      <form className='mx-2 mt-8'>
        <label htmlFor='chat-input' className='sr-only'>
          Search chats
        </label>
        <div className='relative'>
          <input
            id='search-chats'
            type='text'
            className='w-full rounded-lg border border-slate-300 bg-slate-50 p-3 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
            placeholder='Search chats'
            required
          />
          <button
            type='button'
            className='absolute bottom-2 right-2.5 rounded-lg p-2 text-sm text-slate-500 hover:text-primary focus:outline-none sm:text-base'
          >
            <TextSearch className='size-5' />
            <span className='sr-only'>Search chats</span>
          </button>
        </div>
      </form>

      <div className='my-4 flex-1  h-1 space-y-4 overflow-y-auto px-2'>
        <button className='flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-slate-200 focus:outline-none dark:hover:bg-slate-800'>
          <h1 className='text-sm font-medium capitalize text-slate-700 dark:text-slate-200'>
            Tailwind Classes
          </h1>
          <p className='text-xs text-slate-500 dark:text-slate-400'>12 Mar</p>
        </button>
        <button className='flex w-full flex-col gap-y-2 rounded-lg bg-slate-200 px-3 py-2 text-left transition-colors duration-200 focus:outline-none dark:bg-slate-800'>
          <h1 className='text-sm font-medium capitalize text-slate-700 dark:text-slate-200'>
            explain quantum computing
          </h1>
          <p className='text-xs text-slate-500 dark:text-slate-400'>10 Feb</p>
        </button>
        <button className='flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-slate-200 focus:outline-none dark:hover:bg-slate-800'>
          <h1 className='text-sm font-medium capitalize text-slate-700 dark:text-slate-200'>
            How to create ERP Diagram
          </h1>
          <p className='text-xs text-slate-500 dark:text-slate-400'>22 Jan</p>
        </button>
        <button className='flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-slate-200 focus:outline-none dark:hover:bg-slate-800'>
          <h1 className='text-sm font-medium capitalize text-slate-700 dark:text-slate-200'>
            API Scaling Strategies
          </h1>
          <p className='text-xs text-slate-500 dark:text-slate-400'>1 Jan</p>
        </button>
        <button className='flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-slate-200 focus:outline-none dark:hover:bg-slate-800'>
          <h1 className='text-sm font-medium capitalize text-slate-700 dark:text-slate-200'>
            What is GPT UI?
          </h1>
          <p className='text-xs text-slate-500 dark:text-slate-400'>1 Jan</p>
        </button>
        <button className='flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-slate-200 focus:outline-none dark:hover:bg-slate-800'>
          <h1 className='text-sm font-medium capitalize text-slate-700 dark:text-slate-200'>
            How to use Tailwind components?
          </h1>
          <p className='text-xs text-slate-500 dark:text-slate-400'>1 Jan</p>
        </button>
      </div>
      <div className='mx-2 mt-8'>
        <button className='flex w-full flex-row-reverse justify-between rounded-lg bg-slate-600 p-4 text-sm font-medium text-slate-200 transition-colors duration-200 hover:bg-primary-600 focus:outline-none dark:bg-slate-800 dark:hover:bg-primary-600'>
          <Plus className='size-5' />
          <span>New Chat</span>
        </button>
      </div>
    </div>
  )
}
