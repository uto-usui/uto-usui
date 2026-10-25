// リンクにマウスを乗せたときの動き。旧サイトの pages/mixins/linkColor.ts と shuffleText.ts を移した
import { gsap } from 'gsap'
import ShuffleText from 'shuffle-text'

const LINE_COLOR = '#68E3CF'

// data-color のあるリンクに乗ると、枠の線がその色になる
export function linkColorToLine() {
  const line = document.getElementById('js-line')
  const targets = [...document.querySelectorAll('a')].filter(
    (a) => a.dataset.color,
  )

  for (const el of targets) {
    el.addEventListener('mouseenter', () => {
      gsap.to(line, {
        duration: 0.45,
        borderColor: el.dataset.color,
        ease: 'power2.out',
      })
    })
    el.addEventListener('mouseout', () => {
      gsap.to(line, {
        duration: 0.45,
        borderColor: LINE_COLOR,
        ease: 'power2.out',
      })
    })
  }
}

// リンクの文字を入れ替えながら出す
export function shuffleLinks() {
  const effects = [...document.querySelectorAll('a')].map((el) => {
    const effect = new ShuffleText(el)
    effect.duration = 450
    return [el, effect] as const
  })

  for (const [el, effect] of effects) {
    // 旧サイトと同じく子要素から出たときにも始め直す（mouseout は泡立つ）
    el.addEventListener('mouseenter', () => effect.start())
    el.addEventListener('mouseout', () => effect.start())
  }
}
