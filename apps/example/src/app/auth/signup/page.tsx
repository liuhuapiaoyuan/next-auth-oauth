import { signup } from '@/auth'
import { SubmitButton } from '@/components/SubmitButton'

export default async function Signup() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-5">
      <h1 className="p-2  font-bold">Signup Page</h1>
      <form
        action={async (data) => {
          'use server'
          return signup(data)
        }}
        className="flex flex-col gap-5 w-full md:w-[500px] border p-5 "
      >
        <label className="flex items-center gap-2">
          <div>账号: </div>
          <input
            type="text"
            className="flex-1 w-1 block border p-2"
            name="username"
            required
          />
        </label>
        <label className="flex items-center gap-2">
          <span>密码: </span>
          <input
            type="text"
            className="flex-1 w-1 block border p-2"
            name="password"
            required
          />
        </label>
        <SubmitButton className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          提交
        </SubmitButton>
      </form>
    </div>
  )
}
