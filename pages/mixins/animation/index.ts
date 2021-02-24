import { watch } from '@vue/composition-api'
import { useContext } from '@/components/core/getCurrentInstance'
import { gsap } from 'gsap'
import { pause } from '@/assets/js/animation'
import { viewPortSizeType } from '@/store/global/type'
import { random } from '@/assets/js/math'
import { bgmPlay } from '@/pages/mixins/animation/sound'

export const tempo = (60 / 106) * 4

gsap.defaults({ overwrite: 'auto' })

const textAnime = ({ w, h }: viewPortSizeType) => {
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

  gsap.to(items, 1, {
    rotationX: 0,
    y: 0,
    x: 0,
    z: 0,
    autoAlpha: 1,
    ease: 'Power3.out',
    delay: 1,
    stagger: tempo / 64,
  })
}

const showMain = (viewPortSize: viewPortSizeType) => {
  gsap.fromTo(
    '#main',
    {
      y: 300,
    },
    {
      autoAlpha: 1,
      y: 0,
      ease: 'Power2.out',
      duration: 2.5,
      onStart() {
        textAnime(viewPortSize)
      },
    },
  )
}

const shapeAnimation = ({ w, h }: viewPortSizeType) => {
  /**
   * path color infinite
   */
  gsap.to('.js-svg', 1.8, {
    stroke: `hsl(random(170, 220)%, 69%, 65%)`,
    ease: 'none',
    repeat: -1,
    yoyo: true,
  })

  const items = document.querySelectorAll('.js-svg-wrap')

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

  const init = () => {
    bgmPlay()
    move()
    setInterval(move, tempo * 4 * 1000)
  }

  gsap.set(items, {
    transformPerspective: 500,
  })

  gsap.to(items, 0.5, {
    autoAlpha: 1,
    z: -200,
    ease: 'Power2.out',
    onComplete: init,
  })
}

const loaderHide = (viewPortSize) => {
  gsap.to('#js-loader', 0.8, {
    y: -100,
    autoAlpha: 0,
    scale: 0.7,
    ease: 'Power3.In',
    onComplete: async () => {
      await pause(2.5)
      showMain(viewPortSize)
    },
  })
}

export const animationStart = () => {
  const { $getters } = useContext()

  watch(
    () => $getters['global/getIsPageReady'],
    async (value) => {
      await pause(1)
      loaderHide($getters['global/getWindow'])
      shapeAnimation($getters['global/getWindow'])
      console.log('🔥 animationStart', value)
    },
  )
}
