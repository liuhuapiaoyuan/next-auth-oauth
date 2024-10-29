import SliderCaptchaContainer from '@/components/slider-captcha'
import React from 'react'

const AccountSettingsPage = () => {
  return (
    <div>
      <h1>Account Settings</h1>
      <SliderCaptchaContainer
        verify={async (_arr) => {
          'use server'
          console.log('服务端校验', _arr)
          return true
        }}
        onSuccess={async () => {
          'use server'
          console.log('服务端校验成功')
        }}
      />
      <div>asjdio </div>
      <div>asjdio </div>
    </div>
  )
}

export default AccountSettingsPage
