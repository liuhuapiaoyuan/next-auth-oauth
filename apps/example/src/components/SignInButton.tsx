'use client'
import { signIn } from 'next-auth/react'
import { Button } from './ui/button'

export function SignInButton() {
  return <Button onClick={() => signIn()}>登录系统</Button>
}
