// 読み込みのあとの登場の動き。旧サイトの pages/mixins/animation/index.ts を移した。
// 乱数を使う順番（図形の色 → 文字の初期位置 → 図形の移動）も旧サイトと同じにしてある
import { gsap } from 'gsap'
import { SlowMo } from 'gsap/EasePack'
import { bgmPlay } from './sound'

gsap.registerPlugin(SlowMo)
gsap.defaults({ overwrite: 'auto' })

export const tempo = (60 / 106) * 4

const pause = (sec: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, sec * 1000))

const random = (min: number, max: number) => Math.random() * (max - min) + min

const nameIn = () =>
  new Promise<void>((resolve) => {
    gsap.to('#atom-name .js-name', {
      duration: 1,
      x: 0,
      stagger: 0.2,
      ease: 'power3.inOut',
      onComplete: resolve,
    })
  })

const textAnimInit = (w: number, h: number) => {
  const items = document.querySelectorAll('#OVERVIEW .char')
  const moveY = h / 2
  const moveX = w / 2

  gsap.set(items, { transformPerspective: 500 })

  items.forEach((el) => {
    gsap.set(el, {
      autoAlpha: 0.8,
      rotationX: 90 + random(0, 20) - random(0, 20),
      x: random(-moveX * 0.75, moveX * 0.75),
      y: random(-moveY * 0.9, moveY * 0.6),
      z: random(-400, -200),
    })
  })
}

const textAnime = () => {
  const items = document.querySelectorAll('#OVERVIEW .char')
  if (!items.length) return
  gsap.to(items, {
    duration: 1,
    rotationX: 0,
    y: 0,
    x: 0,
    z: 0,
    autoAlpha: 1,
    ease: 'power3.out',
    delay: 1,
    stagger: tempo / 64,
  })
}

const showMain = () => {
  gsap.fromTo(
    '#js-main',
    { y: 300 },
    { autoAlpha: 1, y: 0, ease: 'power2.inOut', duration: 2.25 },
  )
}

const shapeAnimation = (w: number, h: number) => {
  const items = document.querySelectorAll('.js-svg-wrap')

  const move = () => {
    const moveY = h / 2
    const moveX = w / 2

    items.forEach((item, index) => {
      gsap.to(item, {
        duration: tempo,
        y: random(-moveY, moveY),
        x: random(-moveX, moveX),
        z: 'random(-200, 100)',
        delay: 0.1 * index + 1,
        ease: 'slow(0.5, 0.8, false)',
        yoyo: true,
        repeat: 2,
        repeatDelay: tempo * 2.5,
      })
    })
  }

  const start = () => {
    bgmPlay()
    move()
    setInterval(move, tempo * 4 * 1000)
  }

  // 線の色をずっと変え続ける
  gsap.to('.js-svg', {
    duration: 1.8,
    stroke: 'hsl(random(170, 220)%, 69%, 65%)',
    ease: 'none',
    repeat: -1,
    yoyo: true,
  })

  gsap.set(items, { transformPerspective: 500 })

  gsap.to(items, {
    duration: 0.5,
    autoAlpha: 1,
    z: -200,
    ease: 'power2.out',
    delay: 0.6,
    onComplete: start,
  })
}

const loaderHide = () =>
  new Promise<void>((resolve) => {
    gsap.to('#js-loader', {
      duration: 0.8,
      y: -100,
      autoAlpha: 0,
      scale: 0.7,
      ease: 'power3.in',
      onComplete: resolve,
    })
  })

// 動きを減らす設定のときは、動かさずに最後の状態にする
const showStatic = () => {
  gsap.set('#atom-name .js-name', { x: 0 })
  gsap.set('#js-loader', { autoAlpha: 0 })
  gsap.set('#js-main', { autoAlpha: 1 })
}

export async function startIntro() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showStatic()
    return
  }

  // 旧サイトは webfontloader の class を 60ms ごとに見てから始めていた（実際には最初の確認で通っていた）
  await pause(0.06)
  await nameIn()
  await pause(0.1)

  shapeAnimation(window.innerWidth, window.innerHeight)
  await loaderHide()
  textAnimInit(window.innerWidth, window.innerHeight)

  await pause(2.5)

  showMain()
  textAnime()
}
