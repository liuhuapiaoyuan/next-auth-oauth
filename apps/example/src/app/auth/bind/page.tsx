import { tempOauthUser, oauthProviders, auth } from '@/auth'
import { redirect, RedirectType } from 'next/navigation'
import Image from 'next/image'
import { SubmitButton } from '@/components/SubmitButton'

export default async function BindPage() {
  const { bindAccount, account, user: oauthUser } = await tempOauthUser()

  if (!bindAccount || !account) {
    await redirect('/', RedirectType.replace)
  }
  const provider = oauthProviders.find((z) => z.id === account?.provider)
  if (!provider) {
    await redirect('/', RedirectType.replace)
  }
  const session = await auth()
  return (
    <div className="flex items-center justify-center h-screen w-full p-5">
      <div className="flex flex-col gap-2 p-5 w-full bg-white md:w-[456px]  rounded-lg   shadow-md">
        <div className="text-center mb-5 text-lg font-bold">
          继续以完成第三方账号绑定
        </div>
        <div className="flex items-center  justify-center gap-2 mb-5">
          <div className="flex flex-col items-center">
            <Image
              className="dark:invert rounded-full shadow"
              src={session?.user?.image ?? '/logo.png'}
              alt="NextjsBoy"
              width={50}
              height={50}
              priority
            />
            <div>{session?.user?.name}</div>
          </div>
          <div>{`<=>`}</div>
          <div className="flex flex-col items-center">
            <Image
              className="dark:invert rounded-full shadow"
              src={oauthUser?.image ?? provider?.style.logo ?? '/logo.png'}
              alt={oauthUser?.name ?? provider?.name ?? ''}
              width={50}
              height={50}
              priority
            />
            <div>{oauthUser?.name}</div>{' '}
          </div>
        </div>
        <form className="flex flex-col gap-2 p-2 ">
          <SubmitButton>立即绑定</SubmitButton>
        </form>
      </div>
    </div>
  )
}
