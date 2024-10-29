import Link from 'next/link'
import { signinAction } from '../action'
import { oauthProviders } from '@/auth'
import { OauthButton } from '@/components/OauthButton'
import { SigninForm } from '../_components/SigninForm'

export default async function SigninPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl: string }>
}) {
  const { callbackUrl } = await searchParams
  return (
    <div className='flex flex-col items-center justify-center h-screen p-5'>
      <h1 className='p-2  font-bold'>Signin Page</h1>
      <div className='flex flex-col gap-5 w-full md:w-[500px] border p-5 '>
        <form action={signinAction}>
          <SigninForm callbackUrl={callbackUrl} />
          <Link
            href='/auth/signup'
            className='text-blue-500 underline text-xs pt-2'
          >
            没有账号，点击注册
          </Link>
        </form>
        <div className='text-center'>其他登录</div>
        {oauthProviders.map((provider) => {
          return (
            <OauthButton
              backgroundColor={provider.style.brandColor}
              className='w-full'
              callbackUrl={callbackUrl}
              id={provider.id}
              key={provider.id}
              name={provider.name}
            />
          )
        })}
      </div>
    </div>
  )
}
