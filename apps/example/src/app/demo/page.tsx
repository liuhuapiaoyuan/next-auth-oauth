import { auth, signIn } from '@/auth'

export default async function Page() {
  const session = await auth()
  return (
    <div className='flex flex-col gap-5 items-center justify-center h-screen w-full p-5'>
      <h1>
        账户信息:
        {session?.user ? JSON.stringify(session.user) : '未登录'}
      </h1>
      <div>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={async () => {
            'use server'
            await signIn('wechatmp')
          }}
        >
          微信公众号验证码登录
        </button>
      </div>
    </div>
  )
}
