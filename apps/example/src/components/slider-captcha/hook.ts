import { useCallback, useEffect, useRef, useState } from 'react'
import { SliderCaptchaOptions } from '.'

export const DEFAULTS: SliderCaptchaOptions = {
  width: 280,
  height: 155,
  sliderL: 42,
  sliderR: 9,
  offset: 5,
  loadingText: '正在加载中...',
  failedText: '再试一次',
  barText: '向右滑动填充拼图',
  repeatIcon: 'fa fa-repeat',
  maxLoadCount: 3,
  getRandomImage: () => 'images/Pic' + Math.round(Math.random() * 4) + '.jpg',
  verify: async () => {
    return true
  },
}
export const useSliderCaptcha = (options: SliderCaptchaOptions) => {
  const {
    verify,
    offset,
    onSuccess,
    onFail,
    getRandomImage,
    width,
    height,
    sliderL,
    sliderR,
  } = options
  const x = useRef(0)
  const [sliderPosition, setSliderPosition] = useState(0)

  const [loading, setLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const blockRef = useRef<HTMLCanvasElement>(null)
  const dragState = useRef<'start' | 'dragging' | 'end'>('end')
  /**
   * -1->未验证 0->验证中 1->验证成功 2->验证失败
   */
  const [verifyResult, setVerifyResult] = useState<-1 | 0 | 1 | 2>(-1)

  const originX = useRef(0)
  const originY = useRef(0)
  const trail = useRef<number[]>([])

  const blockPosition =
    ((width! - 40 - 20) / (width! - 40)) * (sliderPosition + 1)
  const sliderMaskWidth = sliderPosition + 4

  const loadImage = useCallback(async () => {
    const L = sliderL + sliderR * 2 + 3
    const img = await retryPromise(loadPicture(getRandomImage), 3, 200)
    x.current = getRandomNumber(L + 10, width - (L + 10))
    const y = getRandomNumber(10 + sliderR * 2, height - (L + 10))
    const canvasCtx = canvasRef.current!.getContext('2d')!
    const blockCtx = blockRef.current!.getContext('2d')!
    const config = {
      sliderL: sliderL,
      sliderR: sliderR,
      x: x.current,
      y,
    }
    drawCanvasShape(canvasCtx, 'fill', config)
    blockCtx.save()
    drawCanvasShape(blockCtx, 'clip', config)
    canvasCtx.drawImage(img, 0, 0, width - 2, height)
    blockCtx.drawImage(img, 0, 0, width - 2, height)
    const yPos = y - sliderR * 2 - 1
    const ImageData = blockCtx.getImageData(x.current - 3, yPos, L, L)
    blockCtx.restore() // 恢复状态
    blockCtx.clearRect(0, 0, width, height)
    blockCtx.putImageData(ImageData, 0, yPos)
    setLoading(false)
  }, [getRandomImage, height, sliderL, sliderR, width])

  const clean = useCallback(() => {
    const canvasCtx = canvasRef.current!.getContext('2d')!
    const blockCtx = blockRef.current!.getContext('2d')!
    canvasCtx.clearRect(0, 0, width, height)
    blockCtx.clearRect(0, 0, width, height)
    blockCtx.canvas.width = width
  }, [height, width])

  const reset = useCallback(async () => {
    setSliderPosition(0)
    clean()
    setLoading(true)
    setVerifyResult(-1)
    dragState.current = 'end'
    await loadImage()
  }, [clean, loadImage])

  const handleDragStart = useCallback(
    async (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault()
      if (loading || verifyResult == 0) {
        return
      }
      if (dragState.current !== 'end') {
        return
      }
      dragState.current = 'start'
      trail.current = []
      originX.current = getClientX(e.nativeEvent)
      originY.current = getClientY(e.nativeEvent)
    },
    [loading, verifyResult],
  )
  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (dragState.current == 'end') {
        return
      }
      dragState.current = 'dragging'
      const eventX = getClientX(e)
      const eventY = getClientY(e)
      const moveX = eventX - originX.current
      const moveY = eventY - originY.current
      if (moveX < 0 || moveX + 40 > width!) return
      setSliderPosition(moveX - 1)
      trail.current.push(Math.round(moveY))
    },
    [width],
  )
  const handleDragEnd = useCallback(
    async (e: MouseEvent | TouchEvent) => {
      if (dragState.current !== 'dragging') {
        return
      }
      dragState.current = 'end'
      const eventX = getDragClientX(e)
      if (eventX === originX.current) return
      setVerifyResult(0)
      const verified = await verify(trail.current)
      const spliced = Math.abs(blockPosition - x.current) < offset
      if (spliced && verified) {
        // Success
        setVerifyResult(1)
        onSuccess?.()
      } else {
        setVerifyResult(2)
        setTimeout(() => {
          reset()
        }, 1000)
        onFail?.()
      }
    },
    [blockPosition, offset, onFail, onSuccess, reset, verify, x],
  )
  useEffect(() => {
    console.log('trigger')
    document.addEventListener('mousemove', handleDragMove)
    document.addEventListener('touchmove', handleDragMove)
    return () => {
      document.removeEventListener('mousemove', handleDragMove)
      document.removeEventListener('touchmove', handleDragMove)
    }
  }, [handleDragMove])
  useEffect(() => {
    document.addEventListener('mouseup', handleDragEnd)
    document.addEventListener('touchend', handleDragEnd)
    return () => {
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('touchend', handleDragEnd)
    }
  }, [handleDragEnd])

  useEffect(() => {
    loadImage()
  }, [loadImage])

  return {
    blockPosition,
    handleDragMove,
    handleDragEnd,
    handleDragStart,
    sliderPosition,
    sliderMaskWidth,
    verifyResult,
    loading,
    canvasRef,
    blockRef,
    loadImage,
    clean,
    verify,
    reset,
  }
}

const retryPromise = <T>(
  promise: Promise<T>,
  retries: number = 3,
  delay: number = 200,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    let count = 0
    const intervalId = setInterval(() => {
      count++
      if (count > retries) {
        clearInterval(intervalId)
        reject(new Error('Maximum retries exceeded'))
      } else {
        promise.then(resolve).catch(() => {
          console.log('retrying...')
        })
      }
    }, delay)
  })
}

const loadPicture = (
  src: string | (() => string) | (() => Promise<string>),
) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    if (typeof src === 'function') {
      Promise.resolve(src())
        .then((url) => {
          img.src = url
        })
        .catch(reject)
    } else {
      img.src = src
    }
  })
}

const getRandomNumber = (start: number, end: number) => {
  return Math.round(Math.random() * (end - start) + start)
}
/**
 * 绘制滑块验证码的裁剪框
 * @param ctx
 * @param options
 * @param mergedOptions
 * @returns
 */
function drawCanvasShape(
  ctx: CanvasRenderingContext2D,
  options: 'fill' | 'clip',
  mergedOptions: {
    sliderL: number
    sliderR: number
    x: number
    y: number
  },
) {
  const l = mergedOptions.sliderL
  const r = mergedOptions.sliderR
  const PI = Math.PI
  const x = mergedOptions.x
  const y = mergedOptions.y
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI)
  ctx.lineTo(x + l, y)
  ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI)
  ctx.lineTo(x + l, y + l)
  ctx.lineTo(x, y + l)
  ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true)
  ctx.lineTo(x, y)
  ctx.closePath()
  ctx.lineWidth = 2
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.stroke()
  ctx[options]()
  ctx.globalCompositeOperation = 'destination-over'
  return ctx
}

function getClientX(event: MouseEvent | TouchEvent) {
  if (event instanceof TouchEvent) {
    return event.touches[0].clientX
  }
  return event.clientX
}
function getClientY(event: MouseEvent | TouchEvent) {
  if (event instanceof TouchEvent) {
    return event.touches[0].clientY
  }
  return event.clientY
}
function getDragClientX(event: MouseEvent | TouchEvent) {
  if (event instanceof TouchEvent) {
    return event.changedTouches[0].clientX
  }
  return event.clientX
}
