import { onBeforeUnmount, watchEffect } from '@vue/composition-api'
import { pause } from '@/assets/js/animation'

import { gsap } from 'gsap'

export class LinkColorClass {
  private line: HTMLElement | null
  private targets: HTMLAnchorElement[]

  constructor() {
    this.targets = [...document.querySelectorAll('a')].filter(
      (item) => item.dataset.color,
    )
    this.line = document.getElementById('js-line')

    this.overHandle = this.overHandle.bind(this)
    this.outHandle = this.outHandle.bind(this)
  }

  start() {
    this.targets.forEach((el) => {
      el.addEventListener('mouseenter', this.overHandle)
      el.addEventListener('mouseout', this.outHandle)
    })
  }

  end() {
    this.targets.forEach((el) => {
      el.removeEventListener('mouseenter', this.overHandle)
      el.removeEventListener('mouseout', this.outHandle)
    })
  }

  overHandle({ target }: MouseEvent) {
    if (!(target instanceof HTMLAnchorElement)) return
    if (!target.dataset.color) return
    const { color } = target.dataset

    gsap.to(this.line, 0.45, {
      borderColor: color,
      ease: 'power2.out',
    })

    console.log('🖱 mouseenter', color, this.line)
  }

  outHandle(_e) {
    gsap.to(this.line, 0.45, {
      borderColor: '#68E3CF',
      ease: 'power2.out',
    })
  }
}

/**
 * import pages component
 */
export const linkColorToLine = () => {
  let linkColor = null as LinkColorClass | null

  watchEffect(async () => {
    if (!process.client) return

    await pause(1)

    linkColor = new LinkColorClass()
    linkColor.start()

    console.log('linkColor targets', linkColor)
  })

  onBeforeUnmount(() => {
    if (!linkColor) return

    linkColor.end()
    linkColor = null
  })
}
