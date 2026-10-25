// 慣性スクロールと視差。旧サイトの locomotive-scroll v4.1.4（smooth: true）の動きを、Lenis の上に移した。
// 視差の式・画面に入ったかの判定・位置を測り直す時機は v4 の Smooth.js と Core.js に合わせてある。
// v4 は幅 1024px 未満とタッチ端末で native のスクロールになり、視差も止まる。ここも同じにする
import Lenis from 'lenis'

type Item = {
  el: HTMLElement
  target: HTMLElement
  speed: number
  horizontal: boolean
  top: number
  bottom: number
  middle: number
  inView: boolean
}

export type Scroller = {
  // nav から区画へ移るとき
  scrollTo: (target: HTMLElement) => void
}

const MOBILE_UA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

// v4 の scrollTo の既定（1 秒、cubic-bezier(0.25, 0, 0.35, 1)）
const scrollToEase = cubicBezier(0.25, 0, 0.35, 1)

export function isSmoothContext() {
  const isMobile =
    MOBILE_UA.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
    window.innerWidth < 1024
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  return !isMobile && !reduced
}

export function initScroll(): Scroller {
  const html = document.documentElement
  html.classList.add('has-scroll-init')

  if (!isSmoothContext()) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    return {
      scrollTo: (target) =>
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY,
          behavior: reduced ? 'auto' : 'smooth',
        }),
    }
  }

  html.classList.add('has-scroll-smooth')
  html.setAttribute('data-scroll-direction', 'vertical')

  const lenis = new Lenis({ autoRaf: false, lerp: 0.1 })
  const parallax = createParallax(() => lenis.animatedScroll)
  const scrollbar = createScrollbar(lenis)

  const raf = (time: number) => {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  lenis.on('scroll', () => {
    parallax.tick()
    scrollbar.move()
  })

  // v4 は resize で、ページ側の resizeHandler（すぐ）と自分の checkResize（次の rAF）の 2 回測り直していた
  window.addEventListener('resize', () => {
    parallax.update()
    scrollbar.update()
    requestAnimationFrame(() => {
      parallax.update()
      scrollbar.update()
    })
  })

  // 旧サイトは読み込みの 3 秒後に ls.update() を 2 回呼んで、文字や画像が入ったあとの位置を測り直していた
  setTimeout(() => {
    parallax.update()
    parallax.update()
    scrollbar.update()
  }, 3000)

  return {
    scrollTo: (target) =>
      lenis.scrollTo(target, { duration: 1, easing: scrollToEase }),
  }
}

function createParallax(getScroll: () => number) {
  let windowHeight = window.innerHeight
  let items: Item[] = []

  const translateOf = (el: HTMLElement) => {
    const t = getComputedStyle(el).transform
    if (!t || t === 'none') return { x: 0, y: 0 }
    const m = new DOMMatrixReadOnly(t)
    return { x: m.m41, y: m.m42 }
  }

  const measure = () => {
    const scroll = getScroll()
    items = [
      ...document.querySelectorAll<HTMLElement>('[data-scroll-speed]'),
    ].map((el) => {
      const selector = el.dataset.scrollTarget
      const target =
        (selector && document.querySelector<HTMLElement>(selector)) || el
      const top =
        target.getBoundingClientRect().top + scroll - translateOf(target).y
      const bottom = top + target.offsetHeight
      return {
        el,
        target,
        speed: parseFloat(el.dataset.scrollSpeed ?? '0') / 10,
        horizontal: el.dataset.scrollDirection === 'horizontal',
        top,
        bottom,
        middle: (bottom - top) / 2 + top,
        inView: false,
      }
    })
  }

  const detect = () => {
    const scrollTop = getScroll()
    const scrollBottom = scrollTop + windowHeight
    for (const item of items) {
      if (!item.inView && scrollBottom >= item.top && scrollTop < item.bottom) {
        item.inView = true
      }
      if (item.inView && (scrollBottom < item.top || scrollTop > item.bottom)) {
        item.inView = false
      }
    }
  }

  const transform = (isForced: boolean, setAll = false) => {
    const scrollMiddle = getScroll() + windowHeight / 2
    for (const item of items) {
      let distance: number | false = isForced ? 0 : false
      if (item.inView || setAll) {
        distance = (scrollMiddle - item.middle) * -item.speed
      }
      if (distance === false) continue
      const [x, y] = item.horizontal ? [distance, 0] : [0, distance]
      item.el.style.transform = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,${x},${y},0,1)`
    }
  }

  measure()
  detect()
  transform(true, true)

  return {
    tick() {
      detect()
      transform(false)
    },
    update() {
      windowHeight = window.innerHeight
      measure()
      detect()
      transform(true)
    },
  }
}

// v4 の .c-scrollbar と同じ見た目の細いバー。native のバーは隠す（幅を取ると rem の基準の vw がずれるため）
function createScrollbar(lenis: Lenis) {
  const bar = document.createElement('span')
  const thumb = document.createElement('span')
  bar.className = 'c-scrollbar'
  thumb.className = 'c-scrollbar_thumb'
  bar.append(thumb)
  document.body.append(bar)

  let limit = 0
  let thumbLimit = 0

  const update = () => {
    const barHeight = bar.getBoundingClientRect().height
    limit = lenis.limit
    const thumbHeight = (barHeight * barHeight) / (limit + barHeight)
    thumb.style.height = `${thumbHeight}px`
    thumbLimit = barHeight - thumbHeight
    move()
  }

  const move = () => {
    const y = limit ? (lenis.animatedScroll / limit) * thumbLimit : 0
    thumb.style.transform = `matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,${y},0,1)`
  }

  // つまんで動かす
  thumb.addEventListener('pointerdown', (e) => {
    e.preventDefault()
    thumb.setPointerCapture(e.pointerId)
    document.documentElement.classList.add('has-scroll-dragging')
    const rect = bar.getBoundingClientRect()
    const onMove = (ev: PointerEvent) => {
      const y = ((ev.clientY - rect.top) / rect.height) * limit
      lenis.scrollTo(Math.min(Math.max(y, 0), limit))
    }
    const onUp = () => {
      document.documentElement.classList.remove('has-scroll-dragging')
      thumb.removeEventListener('pointermove', onMove)
      thumb.removeEventListener('pointerup', onUp)
    }
    thumb.addEventListener('pointermove', onMove)
    thumb.addEventListener('pointerup', onUp)
  })

  update()
  return { update, move }
}

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const a = (a1: number, a2: number) => 1 - 3 * a2 + 3 * a1
  const b = (a1: number, a2: number) => 3 * a2 - 6 * a1
  const c = (a1: number) => 3 * a1
  const calc = (t: number, a1: number, a2: number) =>
    ((a(a1, a2) * t + b(a1, a2)) * t + c(a1)) * t
  const slope = (t: number, a1: number, a2: number) =>
    3 * a(a1, a2) * t * t + 2 * b(a1, a2) * t + c(a1)
  return (x: number) => {
    if (x <= 0 || x >= 1) return Math.min(Math.max(x, 0), 1)
    let t = x
    for (let i = 0; i < 8; i++) {
      const s = slope(t, x1, x2)
      if (s === 0) break
      t -= (calc(t, x1, x2) - x) / s
    }
    return calc(t, y1, y2)
  }
}
