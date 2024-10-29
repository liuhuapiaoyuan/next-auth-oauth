'use client'
import { useFormStatus } from 'react-dom'
import { Button, ButtonProps } from './ui/button'
/**
 * 提交按钮
 * @param props
 * @returns
 */
export function SubmitButton({ children, ...props }: ButtonProps) {
  const { pending } = useFormStatus()
  return (
    <Button type='submit' disabled={pending} {...props}>
      {pending ? '提交中...' : children}
    </Button>
  )
}
