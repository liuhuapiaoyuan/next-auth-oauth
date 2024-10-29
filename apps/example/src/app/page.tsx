import { auth } from '@/auth'
import { SignInButton } from '@/components/SignInButton'
import { SignOutButton } from '@/components/SignOutButton'
import { Button } from '@/components/ui/button'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '一起学习Next-auth',
  description: '一起学习Next-auth',
}

export default async function Home() {
  const session = await auth()
  return (
    <div className='font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <Image
          className='dark:invert'
          src='/logo.png'
          alt='Next.js Boy'
          width={180}
          height={38}
          priority
        />
        <div>当前账号信息 ：{session?.user?.name ?? '未登录'}</div>
        {session?.user && (
          <>
            {session.user.image && (
              <Image
                className='dark:invert'
                src={session.user.image}
                alt='Next.js Boy'
                width={180}
                height={38}
                priority
              />
            )}
            <div>userId/email：{session?.user?.id ?? session?.user?.email}</div>
            <div>昵称：{session?.user?.name}</div>
            <code className='text-xs p-2 bg-gray-100 rounded-md shadow'>
              {JSON.stringify(session.user, null, 2)}
            </code>
          </>
        )}
        <div className='flex gap-4 felx-wrap'>
          <Link href='/auth/signup'>
            <Button variant='secondary'>注册账号</Button>
          </Link>
          <SignInButton />
          <Link href='/profile'>
            <Button className='bg-green-500 hover:bg-green-300'>
              个人信息
            </Button>
          </Link>
          {session?.user && <SignOutButton />}
        </div>
      </main>
    </div>
  )
}
