import { auth, authAdapter, listAccount, oauthProviders, signIn } from '@/auth'
import { OauthButton } from '@/components/OauthButton'
import { SignOutButton } from '@/components/SignOutButton'
import { SubmitButton } from '@/components/SubmitButton'
import { revalidatePath } from 'next/cache'
import Image from 'next/image'
import Link from 'next/link'

export default async function ProtectedPage() {
  const session = await auth()
  const user = session?.user

  if (!user) {
    return signIn()
  }
  const accounts = await listAccount()

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8  gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full md:w-[450px] border  p-5 rounded-xl">
        <Image
          className="dark:invert"
          src="/logo.png"
          alt="Next.js Boy"
          width={180}
          height={38}
          priority
        />
        {user.image && (
          <Image
            className="dark:invert w-20 rounded-full shadow"
            src={user.image}
            alt="Next.js Boy"
            width={180}
            height={38}
            priority
          />
        )}
        <div>账号：{user.id}</div>
        <div>昵称：{user.name}</div>
        <div className="flex flex-col w-full gap-2">
          <div>绑定信息列表:</div>
          {oauthProviders.map((provider) => {
            const account = accounts.find((z) => z.provider === provider.id)
            return (
              <div
                key={provider.id}
                className="shadow p-2 hover:bg-gray-100 w-full flex items-center"
              >
                <div className="flex-1">{provider.name}</div>

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
                          revalidatePath('/protected')
                        }}
                      >
                        <SubmitButton className="bg-red-500 hover:bg-red-700">
                          取消绑定
                        </SubmitButton>
                      </form>
                    </div>
                  </>
                ) : (
                  <OauthButton name="点击绑定" id={provider.id} />
                )}
              </div>
            )
          })}
        </div>
        <div className="flex gap-5">
          <Link
            href="/"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-green-500 text-background gap-2 hover:bg-green-700 dark:hover:bg-green-800 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            返回首页
          </Link>
          <SignOutButton />
        </div>
        <div>此处演示，必须登录才可以使用的页面</div>
        <div>如果没有登录直接访问，则会被跳转到登录页面</div>
      </main>
    </div>
  )
}
