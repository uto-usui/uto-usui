import { defineComponent, ref, watch } from '@vue/composition-api'
import { gsap } from 'gsap'
import { tempo } from '@/pages/mixins/animation'

export default defineComponent({
  name: 'AtomSound',

  setup() {
    const play = ref(true)

    watch(play, (value) => {
      if (!process.client) return

      const audio = document.getElementById('js-bgm') as HTMLAudioElement | null
      if (!audio) return

      if (value) {
        audio.play()
        gsap.to(audio, tempo * 1000, { volume: 0.4, ease: 'Power2.in' })
      } else {
        gsap.to(audio, tempo * 1000, { volume: 0, ease: 'Power2.out' })
        audio.pause()
      }
    })

    return { play }
  },
})
