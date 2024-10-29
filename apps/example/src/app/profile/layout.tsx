import { auth, signIn } from '@/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

export default async function ProfileLayout(props: PropsWithChildren) {
  const session = await auth()
  const user = session?.user

  if (!user) {
    return signIn()
  }
  return (
    <div className='flex flex-col md:flex-row h-screen w-full'>
      <div className='flex md:flex-col items-center gap-5  p-5'>
        <h1>Profile</h1>
        <Link href='/profile'>
          <Button variant='link'>个人信息</Button>
        </Link>
        <Link href='/profile/changePass'>
          <Button variant='link'>修改密码</Button>
        </Link>
      </div>
      <div className='flex-1 h-1  md:w-1 md:h-full'>{props.children}</div>
    </div>
  )
}
