import { auth, listAccount, signIn } from "@/lib/auth/auth";
import Image from "next/image";

export default async function ProtectedPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return signIn();
  }
  const accounts = await listAccount();

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
        <div>账号：{JSON.stringify(session)}</div>
        <div>账号：{user.id}</div>
        <div>昵称：{user.name}</div>
        <div>绑定信息列表:</div>

        {accounts.map((account) => (
          <div key={account.id} className="shadow p-2 hover:bg-gray-100">
            <div>类型：{account.type}</div>
            <div>服务商：{account.provider}</div>
            <div>账号：{account.providerAccountId}</div>
          </div>
        ))}
        <div>此处演示，必须登录才可以使用的页面</div>
        <div>如果没有登录直接访问，则会被跳转到登录页面</div>
      </main>
    </div>
  );
}
