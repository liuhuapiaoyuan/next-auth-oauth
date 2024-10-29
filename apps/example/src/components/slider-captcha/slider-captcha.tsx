// slider-captcha.ts

export interface SliderCaptchaOptions {
  width: number
  height: number
  PI: number
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
const DEFAULTS: SliderCaptchaOptions = {
  width: 280,
  height: 155,
  PI: Math.PI,
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
function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className: string,
) {
  const element = document.createElement<K>(tagName)
  element.className = className
  return element
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
const getRandomNumber = (start: number, end: number) => {
  return Math.round(Math.random() * (end - start) + start)
}

const createCanvas = (width: number, height: number) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

function retryPromise<T>(
  promise: Promise<T>,
  retries: number = 3,
  delay: number = 200,
): Promise<T> {
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
function loadPicture(src: string | (() => string) | (() => Promise<string>)) {
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

class SliderCaptcha {
  static VERSION = '0.1'

  private $element: HTMLElement
  private options: SliderCaptchaOptions
  private x: number = 0
  private y: number = 0
  private trail: number[] = []
  private canvasCtx: CanvasRenderingContext2D
  private blockCtx: CanvasRenderingContext2D
  private sliderContainer: HTMLDivElement
  private refreshIcon: HTMLElement
  private slider: HTMLDivElement
  private sliderMask: HTMLDivElement
  private text: HTMLSpanElement
  public destroy: () => void = () => {}
  constructor(element: HTMLElement, options: Partial<SliderCaptchaOptions>) {
    this.$element = element
    this.options = { ...DEFAULTS, ...options }
    this.$element.style.position = 'relative'
    this.$element.style.width = this.options.width + 'px'
    // this.$element.style.margin = '0 auto'

    const canvas = createCanvas(this.options.width - 2, this.options.height)
    const block = canvas.cloneNode(true) as HTMLCanvasElement
    const sliderContainer = createElement('div', 'sliderContainer')
    const refreshIcon = createElement(
      'i',
      'refreshIcon ' + this.options.repeatIcon,
    )
    const sliderMask = createElement('div', 'sliderMask')
    const sliderbg = createElement('div', 'sliderbg')
    const slider = createElement('div', 'slider')
    const sliderIcon = createElement('i', 'fa fa-arrow-right sliderIcon')
    const text = createElement('span', 'sliderText')

    block.className = 'sliderCanvas'
    text.innerHTML = this.options.barText

    this.$element.appendChild(canvas)
    this.$element.appendChild(refreshIcon)
    this.$element.appendChild(block)
    slider.appendChild(sliderIcon)
    sliderMask.appendChild(slider)
    sliderContainer.appendChild(sliderbg)
    sliderContainer.appendChild(sliderMask)
    sliderContainer.appendChild(text)
    this.$element.appendChild(sliderContainer)

    this.canvasCtx = canvas.getContext('2d')!
    this.blockCtx = block.getContext('2d')!
    this.sliderContainer = sliderContainer
    this.refreshIcon = refreshIcon
    this.slider = slider
    this.sliderMask = sliderMask
    this.text = text

    this.loadImage()
    this.text.setAttribute('data-text', this.options.barText)
    this.text.textContent = this.options.loadingText
    this.destroy = this.bindEvents()
  }
  drawClipBox(ctx: CanvasRenderingContext2D, options: 'fill' | 'clip') {
    const l = this.options.sliderL
    const r = this.options.sliderR
    const PI = this.options.PI
    const x = this.x
    const y = this.y
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

  async loadImage() {
    const L = this.options.sliderL + this.options.sliderR * 2 + 3
    const img = await retryPromise(
      loadPicture(this.options.getRandomImage),
      3,
      200,
    )
    this.x = getRandomNumber(L + 10, this.options.width - (L + 10))
    this.y = getRandomNumber(
      10 + this.options.sliderR * 2,
      this.options.height - (L + 10),
    )
    this.drawClipBox(this.canvasCtx, 'fill')
    this.blockCtx.save()
    this.drawClipBox(this.blockCtx, 'clip')

    this.canvasCtx.drawImage(
      img,
      0,
      0,
      this.options.width - 2,
      this.options.height,
    )
    this.blockCtx.drawImage(
      img,
      0,
      0,
      this.options.width - 2,
      this.options.height,
    )
    const y = this.y - this.options.sliderR * 2 - 1
    const ImageData = this.blockCtx.getImageData(this.x - 3, y, L, L)
    this.blockCtx.restore() // 恢复状态
    this.blockCtx.clearRect(0, 0, this.options.width, this.options.height)
    this.blockCtx.putImageData(ImageData, 0, y)
    this.text.textContent = this.text.getAttribute('data-text')!
  }

  clean() {
    this.canvasCtx.clearRect(0, 0, this.options.width, this.options.height)
    this.blockCtx.clearRect(0, 0, this.options.width, this.options.height)
    this.blockCtx.canvas.width = this.options.width
  }

  bindEvents() {
    this.$element.addEventListener('selectstart', () => false)
    this.refreshIcon.addEventListener('click', () => {
      this.text.textContent = this.options.barText
      this.reset()
      if (this.options.onRefresh) this.options.onRefresh.call(this.$element)
    })

    let originX = 0,
      originY = 0,
      isMouseDown = false
    const trail: number[] = []
    const handleDragStart = (e: MouseEvent | TouchEvent) => {
      if (this.text.classList.contains('text-danger')) return
      originX = getClientX(e)
      originY = getClientY(e)
      isMouseDown = true
    }

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      if (!isMouseDown) return false
      const eventX = getClientX(e)
      const eventY = getClientY(e)
      const moveX = eventX - originX
      const moveY = eventY - originY
      if (moveX < 0 || moveX + 40 > this.options.width) return false
      this.slider.style.left = moveX - 1 + 'px'
      const blockLeft =
        ((this.options.width - 40 - 20) / (this.options.width - 40)) * moveX
      this.blockCtx.canvas.style.left = blockLeft + 'px'

      this.sliderContainer.classList.add('sliderContainer_active')
      this.sliderMask.style.width = moveX + 4 + 'px'
      trail.push(Math.round(moveY))
    }

    const handleDragEnd = async (e: MouseEvent | TouchEvent) => {
      if (!isMouseDown) return false
      isMouseDown = false
      const eventX = getDragClientX(e)
      if (eventX === originX) return false
      this.sliderContainer.classList.remove('sliderContainer_active')
      this.trail = trail
      const data = await this.verify()
      if (data.spliced && data.verified) {
        this.sliderContainer.classList.add('sliderContainer_success')
        if (this.options.onSuccess) this.options.onSuccess.call(this.$element)
      } else {
        this.sliderContainer.classList.add('sliderContainer_fail')
        if (this.options.onFail) this.options.onFail.call(this.$element)
        setTimeout(() => {
          this.text.innerHTML = this.options.failedText
          this.reset()
        }, 1000)
      }
    }

    this.slider.addEventListener('mousedown', handleDragStart)
    this.slider.addEventListener('touchstart', handleDragStart)
    document.addEventListener('mousemove', handleDragMove)
    document.addEventListener('touchmove', handleDragMove)
    document.addEventListener('mouseup', handleDragEnd)
    document.addEventListener('touchend', handleDragEnd)
    return () => {
      // unlisten events
      this.slider.removeEventListener('mousedown', handleDragStart)
      this.slider.removeEventListener('touchstart', handleDragStart)
      document.removeEventListener('mousemove', handleDragMove)
      document.removeEventListener('touchmove', handleDragMove)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('touchend', handleDragEnd)
      // 删除所有odm
      this.$element.removeChild(this.refreshIcon)
      this.$element.removeChild(this.sliderContainer)
      this.$element.removeChild(this.canvasCtx.canvas)
      this.$element.removeChild(this.blockCtx.canvas)
    }
    // document.addEventListener('mousedown', () => false)
    // document.addEventListener('touchstart', () => false)
    // document.addEventListener('swipe', () => false)
  }

  async verify() {
    const arr = this.trail
    const left = parseInt(this.blockCtx.canvas.style.left)
    const verified = await this.options.verify(arr)
    return {
      spliced: Math.abs(left - this.x) < this.options.offset,
      verified: verified,
    }
  }

  async reset() {
    this.sliderContainer.classList.remove('sliderContainer_fail')
    this.sliderContainer.classList.remove('sliderContainer_success')
    this.slider.style.left = '0px'
    this.blockCtx.canvas.style.left = '0px'
    this.sliderMask.style.width = '0px'
    this.clean()
    this.text.setAttribute('data-text', this.text.textContent!)
    this.text.textContent = this.options.loadingText
    await this.loadImage()
  }
}

export { SliderCaptcha }
