export const bgmPlay = () => {
  const bgm = document.getElementById('js-bgm') as HTMLAudioElement | null
  if (!bgm) return

  console.log(bgm)

  bgm.muted = false
  bgm.loop = true
  bgm.volume = 0.4
  bgm.play()
}
