'use client'
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes } from 'react'
import { useFormStatus } from 'react-dom'
/**
 * 提交按钮
 * @param props
 * @returns
 */
export function SubmitButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      className={cn(
        'rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5',
        className,
      )}
      {...props}
    >
      {pending ? '提交中...' : props.children}
    </button>
  )
}
