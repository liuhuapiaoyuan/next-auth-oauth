'use client'
import { SubmitButton } from '@/components/SubmitButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useActionStateFull } from '@/lib/action'
import Form from 'next/form'
import { changePassAction } from '../action'

export default function ChangePasswordPage() {
  const [data, submit] = useActionStateFull(changePassAction)
  return (
    <div className='p-5'>
      <h1 className='text-3xl font-bold mb-5'>Change Password</h1>
      <Form action={submit}>
        <div className='flex flex-col gap-5'>
          <div className='grid w-full   gap-1.5'>
            <Label htmlFor='oldPassword'>原始密码：</Label>
            <Input
              name='oldPassword'
              id='oldPassword'
              placeholder='原始没面...'
              type='password'
              required
            />
          </div>
          <div className='grid w-full   gap-1.5'>
            <Label htmlFor='newPassword'>新密码</Label>
            <Input
              name='newPassword'
              id='newPassword'
              placeholder='输入新的密码...'
              type='password'
              required
            />
          </div>
          <div className='grid w-full   gap-1.5'>
            <Label htmlFor='confirmPassword'>确认密码</Label>
            <Input
              name='confirmPassword'
              id='confirmPassword'
              placeholder='password...'
              type='password'
              required
            />
          </div>
          {data.error && <div>操作失误：{data.error.message}</div>}
          <SubmitButton className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            确认修改
          </SubmitButton>
        </div>
      </Form>
    </div>
  )
}
