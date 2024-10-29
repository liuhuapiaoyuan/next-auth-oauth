'use client'

import { useEffect, useRef } from 'react'
import { SliderCaptcha, SliderCaptchaOptions } from './slider-captcha'
import './slider-captcha.css'
export default function SliderCaptchaContainer(props: {
  verify: SliderCaptchaOptions['verify']
  onSuccess: SliderCaptchaOptions['onSuccess']
}) {
  const container = useRef<HTMLDivElement | null>(null)
  const sliderCaptchaRef = useRef<SliderCaptcha | null>(null)
  useEffect(() => {
    if (container.current && !sliderCaptchaRef.current) {
      sliderCaptchaRef.current = new SliderCaptcha(container.current, {
        verify: props.verify,
        onSuccess: props.onSuccess,
      })
    }
    return () => {
      if (sliderCaptchaRef.current) {
        sliderCaptchaRef.current.destroy()
        sliderCaptchaRef.current = null
      }
    }
  }, [props.onSuccess, props.verify])
  return <div ref={container}></div>
}
