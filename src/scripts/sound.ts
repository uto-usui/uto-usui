// BGM。旧サイトは登場の動きの途中で再生を試み（ブラウザの自動再生の制限でたいてい止められる）、
// ボタンは最初から「再生中」の見た目だった
const bgm = () => document.getElementById('js-bgm') as HTMLAudioElement | null
const button = () => document.getElementById('js-sound')

// ボタンが「再生中」の見た目か。ウィンドウを離れて戻ったときに、再生を戻すかどうかに使う
let wantPlay = true

const setButton = (play: boolean) => {
  wantPlay = play
  button()?.classList.toggle('is-play', play)
  button()?.setAttribute('aria-pressed', String(play))
}

const play = () => {
  const audio = bgm()
  if (!audio) return
  audio.muted = false
  audio.loop = true
  audio.volume = 0.4
  return audio.play()
}

export const bgmPlay = () => {
  play()?.catch(() => {
    // 自動再生が止められた。見た目は旧サイトと同じく「再生中」のまま、押されたら鳴らす
  })
}

export function initSound() {
  button()?.addEventListener('click', () => {
    const audio = bgm()
    if (!audio) return
    // 自動再生が止められて鳴っていないときは、1 回目の押下で鳴らす
    if (audio.paused) {
      setButton(true)
      play()?.catch(() => setButton(false))
    } else {
      setButton(false)
      audio.pause()
    }
  })

  window.addEventListener('focus', () => {
    if (wantPlay) play()?.catch(() => {})
  })
  window.addEventListener('blur', () => {
    if (wantPlay) bgm()?.pause()
  })
}
