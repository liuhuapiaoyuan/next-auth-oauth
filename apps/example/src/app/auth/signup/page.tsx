'use client'
import { SubmitButton } from '@/components/SubmitButton'
import { signupAction } from '../action'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function Signup() {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center h-screen p-5">
      <h1 className="p-2  font-bold">Signup Page</h1>
      <form
        action={async (data) => {
          return signupAction(data).then(() => {
            alert('注册成功')
            router.replace('/auth/signin')
          })
        }}
        className="flex flex-col gap-5 w-full md:w-[500px] border p-5 "
      >
        <div className="grid w-full   gap-1.5">
          <Label htmlFor="username">账号</Label>
          <Input
            name="username"
            id="username"
            placeholder="Username/Email/Mobile"
          />
        </div>
        <div className="grid w-full   gap-1.5">
          <Label htmlFor="password">密码</Label>
          <Input
            name="password"
            id="password"
            placeholder="password..."
            type="password"
          />
        </div>
        <SubmitButton className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          注册账号
        </SubmitButton>
        <div>
          <Link href="/auth/signin" className="text-blue-500 underline">
            直接登录
          </Link>
        </div>
      </form>
    </div>
  )
}
