import { watchEffect } from '@vue/composition-api'
import { useContext } from '@/components/core/getCurrentInstance'
import { gsap } from 'gsap'
import { pause } from '@/assets/js/animation'
import { viewPortSizeType } from '@/store/global/type'
import { random } from '@/assets/js/math'
import { bgmPlay } from '@/pages/mixins/animation/sound'

export const tempo = (60 / 106) * 4

gsap.defaults({ overwrite: 'auto' })

const nameIn = () => {
  const items = document.querySelectorAll('#atom-name .js-name')

  return new Promise<void>((resolve) => {
    gsap.to(items, 1, {
      x: 0,
      stagger: 0.2,
      ease: 'power3.inOut',
      onComplete: () => {
        resolve()
      },
    })
  })
}

/**
 * initialize text animation
 *
 * @param h
 * @param w
 */
const textAnimInit = ({ h, w }: viewPortSizeType) => {
  const items = document.querySelectorAll('#OVERVIEW .char')

  const moveY = h / 2
  const moveX = w / 2

  gsap.set(items, {
    transformPerspective: 500,
  })

  items.forEach((el, _i) => {
    gsap.set(el, {
      autoAlpha: 0.8,
      rotationX: 90 + random(0, 20) - random(0, 20),
      x: random(-moveX * 0.75, moveX * 0.75),
      y: random(-moveY * 0.9, moveY * 0.6),
      z: random(-400, -200),
    })
  })
}

/**
 * play text animation
 */
const textAnime = () => {
  const items = document.querySelectorAll('#OVERVIEW .char')

  gsap.to(items, 1, {
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

/**
 * show main wrapper
 */
const showMain = () => {
  gsap.fromTo(
    '#js-main',
    {
      y: 300,
    },
    {
      autoAlpha: 1,
      y: 0,
      ease: 'power2.inOut',
      duration: 2.25,
    },
  )
}

const shapeAnimation = ({ w, h }: viewPortSizeType) => {
  const items = document.querySelectorAll('.js-svg-wrap')

  /**
   * move shapes on window
   */
  const move = () => {
    const moveY = h / 2
    const moveX = w / 2

    items.forEach((item, index) => {
      gsap.to(item, tempo, {
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

  /**
   * path color infinite
   */
  gsap.to('.js-svg', 1.8, {
    stroke: `hsl(random(170, 220)%, 69%, 65%)`,
    ease: 'none',
    repeat: -1,
    yoyo: true,
  })

  gsap.set(items, {
    transformPerspective: 500,
  })

  /**
   * shape in
   */
  gsap.to(items, 0.5, {
    autoAlpha: 1,
    z: -200,
    ease: 'power2.out',
    delay: 0.6,
    onComplete: start,
  })
}

/**
 * hide loader
 */
const loaderHide = () => {
  return new Promise<void>((resolve) => {
    gsap.to('#js-loader', 0.8, {
      y: -100,
      autoAlpha: 0,
      scale: 0.7,
      ease: 'power3.in',
      onComplete: () => {
        resolve()
      },
    })
  })
}

/**
 * font load checker
 * @param name {string}
 */
const checkLoadFont = (name: string) => {
  const html = document.getElementsByTagName('html')
  const _html = html.item(0)

  return new Promise<void>((resolve) => {
    const timer = setInterval(() => {
      if (_html && _html.classList.contains(name)) {
        console.log('𝓣 loaded :)')

        clearInterval(timer)
        resolve()
      }
    }, 60)

    console.log(timer)
  })
}

export const animationStart = () => {
  const { $getters } = useContext()

  watchEffect(async () => {
    if (!process.client) return

    await checkLoadFont('wf-playfairdisplay-n4-inactive')
    await nameIn()

    await pause(0.1)

    shapeAnimation($getters['global/getWindow'])
    await loaderHide()
    textAnimInit($getters['global/getWindow'])

    await pause(2.5)

    showMain()
    textAnime()

    console.log('🔥 animationStart')
  })
}
