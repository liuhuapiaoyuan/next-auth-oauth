'use server'

import { auth, authService } from '@/auth'

export async function changePassAction(data: FormData) {
  const user = await auth()
  if (!user?.user?.id) {
    throw new Error('账号未登录')
  }
  await authService.changePass(
    user.user.id,
    data.get('oldPassword') as string,
    data.get('newPassword') as string,
  )
  return true
}
