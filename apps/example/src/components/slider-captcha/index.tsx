'use client'
import React from 'react'
import { DEFAULTS, useSliderCaptcha } from './hook'
import { SlideRightIcon } from './SlideRightIcon'
export interface SliderCaptchaOptions {
  width: number
  height: number
  sliderL: number
  sliderR: number
  offset: number
  loadingText: string
  failedText: string
  barText: string
  repeatIcon: string
  maxLoadCount: number
  getRandomImage: () => string
  verify: (arr: number[]) => Promise<boolean>
  onRefresh?: () => void
  onSuccess?: () => void
  onFail?: () => void
}

const VERIFY_RESULT = {
  '-1': '',
  '0': '验证中',
  '1': '验证成功',
  '2': '验证失败',
}
const VERIFY_COLOR = {
  '0': 'blue',
  '1': '#52ccba',
  '2': 'red',
}

const SliderCaptchaComponent: React.FC<Partial<SliderCaptchaOptions>> = (
  props,
) => {
  const options = { ...DEFAULTS, ...props }
  const {
    sliderPosition,
    sliderMaskWidth,
    blockPosition,
    loading,
    verifyResult,
    canvasRef,
    blockRef,
    handleDragStart,
  } = useSliderCaptcha(options)
  const color = VERIFY_COLOR[`${verifyResult}` as '0']
  const style = {
    width: options.width,
    '--slide-color': color, // 设置 CSS 变量
  }
  return (
    <div className='p-2 border rounded-lg inline-block'>
      <div data-verify={verifyResult} className='relative group' style={style}>
        <canvas
          ref={canvasRef}
          width={options.width! - 2}
          height={options.height!}
        />
        <canvas
          ref={blockRef}
          className='absolute left-0 top-0'
          width={options.width}
          height={options.height!}
          style={{ left: blockPosition }}
        />
        <div
          onTouchStart={handleDragStart}
          onMouseDown={handleDragStart}
          className='relative    text-center leading-10 bg-gray-100 text-gray-700 rounded'
        >
          <div className='absolute left-[1px] right-[1px] top-0 bg-gray-100 h-10 rounded border border-gray-300' />
          <div
            className='absolute top-0 bottom-0  bg-blue-100'
            style={{ width: sliderMaskWidth }}
          ></div>
          {verifyResult < 0 && (
            <div
              className='absolute
              border hover:border-blue-500
              z-10 hover:bg-blue-300 group/slide  
               top-0 left-0 w-10 h-10 bg-white shadow 
               cursor-pointer transition-colors duration-200 rounded flex items-center justify-center'
              style={{ left: sliderPosition }}
            >
              <SlideRightIcon className='group-hover/slide:scale-[1.1]' />
            </div>
          )}
          {/* 图片加载显示图片加载，验证显示验证 */}
          <span className='relative  pointer-events-none text-[var(--slide-color)]'>
            {loading
              ? options.loadingText
              : verifyResult >= 0
                ? VERIFY_RESULT[verifyResult]
                : options.barText}
          </span>
        </div>
      </div>
    </div>
  )
}

export default SliderCaptchaComponent
