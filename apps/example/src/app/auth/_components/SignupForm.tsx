import { SubmitButton } from '@/components/SubmitButton'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

/**
 * 注册表单
 * @param param0
 * @returns
 */
export function SignupForm({
  callbackUrl,
  nickname,
}: {
  callbackUrl: string
  nickname?: string | null
}) {
  return (
    <>
      <div className='flex flex-col gap-5'>
        <input type='hidden' name='redirectTo' value={callbackUrl} />
        <div className='grid w-full   gap-1.5'>
          <Label htmlFor='nickname'>昵称</Label>
          <Input
            defaultValue={nickname ?? ''}
            id='nickname'
            name='nickname'
            placeholder='昵称'
          />
        </div>
        <div className='grid w-full   gap-1.5'>
          <Label htmlFor='username'>账号</Label>
          <Input
            name='username'
            id='username'
            placeholder='Username/Email/Mobile'
          />
        </div>
        <div className='grid w-full   gap-1.5'>
          <Label htmlFor='password'>密码</Label>
          <Input
            name='password'
            id='password'
            placeholder='password...'
            type='password'
          />
        </div>
        <SubmitButton className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
          注册
        </SubmitButton>
      </div>
    </>
  )
}
