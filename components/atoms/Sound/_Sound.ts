import {
  defineComponent,
  nextTick,
  onMounted,
  ref,
  watch,
} from '@vue/composition-api'
import { gsap } from 'gsap'
import { tempo } from '@/pages/mixins/animation'

export default defineComponent({
  name: 'AtomSound',

  setup() {
    const isPlay = ref(true)

    const play = () => {
      const audio = document.getElementById('js-bgm') as HTMLAudioElement | null
      if (!audio) return

      audio.play()
      gsap.to(audio, tempo * 1000, { volume: 0.4, ease: 'Power2.in' })
    }

    const pause = () => {
      const audio = document.getElementById('js-bgm') as HTMLAudioElement | null
      if (!audio) return

      gsap.to(audio, tempo * 1000, { volume: 0, ease: 'Power2.out' })
      audio.pause()
    }

    watch(isPlay, (value) => {
      if (!process.client) return

      if (value) {
        play()
      } else {
        pause()
      }
    })

    onMounted(() => {
      nextTick(() => {
        window.addEventListener('focus', () => {
          isPlay.value && play()
        })
        window.addEventListener('blur', () => {
          isPlay.value && pause()
        })
      })
    })

    return { isPlay }
  },
})
