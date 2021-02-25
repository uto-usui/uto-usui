import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
} from '@vue/composition-api'
import { pause } from '@/assets/js/animation'
import { TypoInit } from '@/assets/js/typo/TypoInit'
import { nameTexture } from '@/assets/js/typo/texture'

export default defineComponent({
  name: 'AtomCanvas',
  props: {
    text: { type: String, default: '' },
  },

  setup() {
    const canvas = ref<HTMLCanvasElement | null>(null)

    const isActive = ref(false)

    let img = null as null | HTMLImageElement
    let typo = null as null | TypoInit
    let frameID = 0

    const update = () => {
      if (!typo) return

      typo.update()
      //
      frameID = requestAnimationFrame(() => {
        update()
      })
    }

    const typoStart = async () => {
      if (!img) return

      // console.log('typoStart', img.width) 300
      // console.log('typoStart', img.height) 65
      typo = new TypoInit({ wrap: canvas.value, img })
      await pause(0.05)

      isActive.value = true

      typo.start()
      update()
    }

    const loadImage = () => {
      img = new Image()
      // make it base64
      const svg64 = window.btoa(nameTexture)
      const b64Start = 'data:image/svg+xml;base64,'

      img.onload = () => {
        typoStart()
      }
      img.src = b64Start + svg64
    }

    onMounted(() => {
      loadImage()
    })

    onBeforeUnmount(() => {
      cancelAnimationFrame(frameID)

      if (!typo) return
      typo.finish()
    })

    return { canvas, isActive }
  },
})
