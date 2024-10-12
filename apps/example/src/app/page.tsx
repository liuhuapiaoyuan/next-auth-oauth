import { auth } from '@/lib/auth/auth'
import { SignInButton } from '@/components/SignInButton'
import { SignOutButton } from '@/components/SignOutButton'
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
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/logo.png"
          alt="Next.js Boy"
          width={180}
          height={38}
          priority
        />
        <div>当前账号信息 ：{session?.user?.name ?? '未登录'}</div>
        {session?.user && (
          <>
            {session.user.image && (
              <Image
                className="dark:invert"
                src={session.user.image}
                alt="Next.js Boy"
                width={180}
                height={38}
                priority
              />
            )}
            <div>userId/email：{session?.user?.email}</div>
            <div>昵称：{session?.user?.name}</div>
            <code className="text-xs p-2 bg-gray-100 rounded-md shadow">
              {JSON.stringify(session.user, null, 2)}
            </code>
          </>
        )}
        <div className="flex gap-4">
          <SignInButton />

          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-[#2933c2] text-background gap-2 hover:bg-[#175d86] dark:hover:bg-[#175d86] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            type="submit"
            href="/protected"
          >
            个人信息(如未登录则会跳转到登录页面)
          </Link>

          {session?.user && <SignOutButton />}
        </div>
      </main>
    </div>
  )
}
