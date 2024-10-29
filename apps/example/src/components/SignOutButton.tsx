import { signOut } from '@/auth'
import { SubmitButton } from './SubmitButton'

export function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server'
        await signOut()
      }}
    >
      <SubmitButton variant='danger' type='submit'>
        退出系统
      </SubmitButton>
    </form>
  )
}
