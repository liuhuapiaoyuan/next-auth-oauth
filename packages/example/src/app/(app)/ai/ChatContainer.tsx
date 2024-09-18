import { Button } from '@/components/ui/button'
import { MicrochipIcon } from 'lucide-react'
import { ChatContainerInput } from './ChatContainerInput'

export function ChatContainer() {
  return (
    <div className='flex h-full gap-2 w-full flex-col'>
      <div className='flex-1 overflow-y-auto rounded-xl bg-slate-200 p-4 text-sm leading-6 text-slate-900 dark:bg-slate-800 dark:text-slate-300 sm:text-base sm:leading-7'>
        <div className='flex flex-row px-2 py-4 sm:px-4'>
          <img
            className='mr-2 flex h-8 w-8 rounded-full sm:mr-4'
            src='https://dummyimage.com/256x256/363536/ffffff&text=U'
          />

          <div className='flex max-w-3xl items-center'>
            <p>Explain quantum computing in simple terms</p>
          </div>
        </div>
        <div className='mb-2 flex w-full flex-row justify-end gap-x-2 text-slate-500'>
          <button className='hover:text-blue-600'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 24 24'
              stroke-width='2'
              stroke='currentColor'
              fill='none'
              stroke-linecap='round'
              strokeLinejoin='round'
            >
              <path stroke='none' d='M0 0h24v24H0z' fill='none' />
              <path d='M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3' />
            </svg>
          </button>
          <button className='hover:text-blue-600' type='button'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 24 24'
              stroke-width='2'
              stroke='currentColor'
              fill='none'
              stroke-linecap='round'
              strokeLinejoin='round'
            >
              <path stroke='none' d='M0 0h24v24H0z' fill='none' />
              <path d='M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3' />
            </svg>
          </button>
          <button className='hover:text-blue-600' type='button'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 24 24'
              stroke-width='2'
              stroke='currentColor'
              fill='none'
              stroke-linecap='round'
              strokeLinejoin='round'
            >
              <path stroke='none' d='M0 0h24v24H0z' fill='none' />
              <path d='M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z' />
              <path d='M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2' />
            </svg>
          </button>
        </div>
        <div className='mb-4 flex rounded-xl bg-slate-50 px-2 py-6 dark:bg-slate-900 sm:px-4'>
          <img
            className='mr-2 flex h-8 w-8 rounded-full sm:mr-4'
            src='https://dummyimage.com/256x256/354ea1/ffffff&text=G'
          />

          <div className='flex max-w-3xl items-center rounded-xl'>
            <p>
              Certainly! Quantum computing is a new type of computing that
              relies on the principles of quantum physics. Traditional
              computers, like the one you might be using right now, use bits to
              store and process information. These bits can represent either a 0
              or a 1. In contrast, quantum computers use quantum bits, or
              qubits.
              <br />
              <br />
              Unlike bits, qubits can represent not only a 0 or a 1 but also a
              superposition of both states simultaneously. This means that a
              qubit can be in multiple states at once, which allows quantum
              computers to perform certain calculations much faster and more
              efficiently
            </p>
          </div>
        </div>
        <div className='flex px-2 py-4 sm:px-4'>
          <img
            className='mr-2 flex h-8 w-8 rounded-full sm:mr-4'
            src='https://dummyimage.com/256x256/363536/ffffff&text=U'
          />

          <div className='flex max-w-3xl items-center'>
            <p>What are three great applications of quantum computing?</p>
          </div>
        </div>
        <div className='mb-2 flex w-full flex-row justify-end gap-x-2 text-slate-500'>
          <button className='hover:text-blue-600'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 24 24'
              stroke-width='2'
              stroke='currentColor'
              fill='none'
              stroke-linecap='round'
              strokeLinejoin='round'
            >
              <path stroke='none' d='M0 0h24v24H0z' fill='none' />
              <path d='M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3' />
            </svg>
          </button>
          <button className='hover:text-blue-600' type='button'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 24 24'
              stroke-width='2'
              stroke='currentColor'
              fill='none'
              stroke-linecap='round'
              strokeLinejoin='round'
            >
              <path stroke='none' d='M0 0h24v24H0z' fill='none' />
              <path d='M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3' />
            </svg>
          </button>
          <button className='hover:text-blue-600' type='button'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 24 24'
              stroke-width='2'
              stroke='currentColor'
              fill='none'
              stroke-linecap='round'
              strokeLinejoin='round'
            >
              <path stroke='none' d='M0 0h24v24H0z' fill='none' />
              <path d='M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z' />
              <path d='M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2' />
            </svg>
          </button>
        </div>
        <div className='mb-4 flex rounded-xl bg-slate-50 px-2 py-6 dark:bg-slate-900 sm:px-4'>
          <img
            className='mr-2 flex h-8 w-8 rounded-full sm:mr-4'
            src='https://dummyimage.com/256x256/354ea1/ffffff&text=G'
          />

          <div className='flex max-w-3xl items-center rounded-xl'>
            <p>
              Three great applications of quantum computing are: Optimization of
              complex problems, Drug Discovery and Cryptography.
            </p>
          </div>
        </div>
      </div>

      <div className='mt-4 flex w-full gap-x-2 overflow-x-auto whitespace-nowrap text-xs text-slate-600 dark:text-slate-300 sm:text-sm'>
        <button className='rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50'>
          Regenerate response
        </button>
        <button className='rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50'>
          Use prompt suggestions
        </button>
        <button className='rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50'>
          Toggle web search
        </button>
      </div>

      <ChatContainerInput />
    </div>
  )
}
