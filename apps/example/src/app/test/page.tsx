import SliderCaptcha from '@/components/slider-captcha/index'
import React from 'react'

const AccountSettingsPage = () => {
  return (
    <div>
      <h1>Account Settings</h1>
      <SliderCaptcha
        verify={async (datas) => {
          'use server'
          const sum = datas.reduce((acc, data) => acc + data, 0)
          const avg = sum / datas.length
          const sum2 = datas.reduce(
            (acc, data) => acc + Math.pow(data - avg, 2),
            0,
          )
          const stddev = sum2 / datas.length
          return stddev !== 0
        }}
        onSuccess={async () => {
          'use server'
          console.log('服务端校验成功')
        }}
      />
      <SliderCaptcha
        verify={async (datas) => {
          'use server'
          const sum = datas.reduce((acc, data) => acc + data, 0)
          const avg = sum / datas.length
          const sum2 = datas.reduce(
            (acc, data) => acc + Math.pow(data - avg, 2),
            0,
          )
          const stddev = sum2 / datas.length
          return stddev !== 0
        }}
      />
    </div>
  )
}

export default AccountSettingsPage
