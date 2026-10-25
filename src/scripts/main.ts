import { startIntro } from './intro'
import { linkColorToLine, shuffleLinks } from './links'
import { initScroll } from './scroll'
import { initSound } from './sound'

const scroller = initScroll()

startIntro()
initSound()

// nav は旧サイトと同じく、URL を変えずに区画まで動かす
for (const a of document.querySelectorAll<HTMLAnchorElement>('.mn__target')) {
  a.addEventListener('click', (e) => {
    const target = document.querySelector<HTMLElement>(
      a.getAttribute('href') ?? '',
    )
    if (!target) return
    e.preventDefault()
    scroller.scrollTo(target)
  })
}

// 旧サイトは 1 秒待ってから、リンクに動きを付けていた
setTimeout(() => {
  linkColorToLine()
  shuffleLinks()
}, 1000)
