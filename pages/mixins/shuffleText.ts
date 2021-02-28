import { onBeforeUnmount, watchEffect } from '@vue/composition-api'
import { pause } from '@/assets/js/animation'
import ShuffleText from 'shuffle-text'

export class ShuffleTextClass {
  private targets: HTMLElement[]
  private effects: ShuffleText[]

  constructor() {
    this.targets = [...document.querySelectorAll<HTMLElement>('a')]
    this.effects = []

    this.animation = this.animation.bind(this)
  }

  start() {
    this.targets.forEach((el, i) => {
      el.dataset.index = i + ''
      // @ts-ignore
      this.effects[i] = new ShuffleText(el)
      this.effects[i].duration = 450

      el.addEventListener('mouseenter', this.animation)
      el.addEventListener('mouseout', this.animation)
    })
  }

  end() {
    this.targets.forEach((el) => {
      el.removeEventListener('mouseenter', this.animation)
      el.removeEventListener('mouseout', this.animation)
    })
    this.effects.forEach((el) => {
      el.dispose()
    })
  }

  animation({ target }: MouseEvent) {
    if (!(target instanceof HTMLElement) || !target.dataset.index) return

    this.effects[target.dataset.index].start()
  }
}

/**
 * import pages component
 */
export const Shuffle = () => {
  let shuffleText = null as ShuffleTextClass | null

  watchEffect(async () => {
    if (!process.client) return

    await pause(1)

    shuffleText = new ShuffleTextClass()
    shuffleText.start()
  })

  onBeforeUnmount(() => {
    if (!shuffleText) return

    shuffleText.end()
    shuffleText = null
  })
}
