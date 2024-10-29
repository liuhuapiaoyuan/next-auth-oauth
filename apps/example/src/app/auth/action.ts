'use server'
import { signIn, signUp } from '@/auth'

export async function signupAction(data: FormData) {
  return signUp(data)
}
export async function signinAction(data: FormData) {
  return signIn('credentials', data)
}
