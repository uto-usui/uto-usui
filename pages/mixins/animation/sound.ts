import { tempo } from '@/pages/mixins/animation/index'
import { gsap } from 'gsap'

export const audioControl = () => {
  const audio = document.getElementById('js-bgm') as HTMLAudioElement | null
  if (!audio) return
  const button = document.getElementById('js-sound') as HTMLAudioElement | null
  if (!button) return

  window.addEventListener('focus', () => {
    audio.play()
    gsap.to(audio, tempo * 1000, { volume: 0.4, ease: 'Power2.in' })
  })

  window.addEventListener('blur', () => {
    gsap.to(audio, tempo * 1000, { volume: 0, ease: 'Power2.out' })
    audio.pause()
  })
}

export const bgmPlay = () => {
  const bgm = document.getElementById('js-bgm') as HTMLAudioElement | null
  if (!bgm) return

  console.log(bgm)

  bgm.muted = false
  bgm.loop = true
  bgm.volume = 0.4
  bgm.play()

  audioControl()
}
