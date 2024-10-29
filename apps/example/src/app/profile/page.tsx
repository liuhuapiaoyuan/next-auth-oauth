import { auth, authAdapter, listAccount, oauthProviders, signIn } from '@/auth'
import { OauthButton } from '@/components/OauthButton'
import { SignOutButton } from '@/components/SignOutButton'
import { SubmitButton } from '@/components/SubmitButton'
import { Button } from '@/components/ui/button'
import { revalidatePath } from 'next/cache'
import Image from 'next/image'
import Link from 'next/link'

export default async function ProfilePage() {
  const session = await auth()
  const user = session?.user

  if (!user) {
    return signIn()
  }
  const accounts = await listAccount()

  return (
    <div className='w-full p-5 h-full  overflow-y-auto  '>
      <h1 className='text-3xl font-bold mb-5'>Profile </h1>
      <div className='flex flex-col gap-5 items-center sm:items-start w-full md:w-[450px]   p-5 '>
        <Image
          className='dark:invert'
          src='/logo.png'
          alt='Next.js Boy'
          width={180}
          height={38}
          priority
        />
        {user.image && (
          <Image
            className='dark:invert w-20 rounded-full shadow'
            src={user.image}
            alt='Next.js Boy'
            width={180}
            height={38}
            priority
          />
        )}
        <div>账号：{user.id}</div>
        <div>昵称：{user.name}</div>
        <div className='flex flex-col w-full gap-2'>
          <div>绑定信息列表:</div>
          {oauthProviders.map((provider) => {
            const account = accounts.find((z) => z.provider === provider.id)
            return (
              <div
                key={provider.id}
                className='shadow p-2 hover:bg-gray-100 w-full flex items-center'
              >
                <div className='flex-1'>{provider.name}</div>

                {account ? (
                  <>
                    <div>已绑定：{account.providerAccountId}</div>
                    <div>
                      <form
                        action={async () => {
                          'use server'
                          await authAdapter.unlinkAccount?.({
                            provider: provider.id,
                            providerAccountId: account.providerAccountId,
                          })
                          revalidatePath('/profile')
                        }}
                      >
                        <SubmitButton
                          size='sm'
                          className='bg-red-500 hover:bg-red-700'
                        >
                          取消绑定
                        </SubmitButton>
                      </form>
                    </div>
                  </>
                ) : (
                  <OauthButton size='sm' name='点击绑定' id={provider.id} />
                )}
              </div>
            )
          })}
        </div>
        <div className='flex gap-5'>
          <Link href='/'>
            <Button>返回首页</Button>
          </Link>

          <SignOutButton />
        </div>
        <div>此处演示，必须登录才可以使用的页面</div>
        <div>如果没有登录直接访问，则会被跳转到登录页面</div>
      </div>
    </div>
  )
}
