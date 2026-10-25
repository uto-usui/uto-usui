// splitting 1.1.0 の Splitting.html({ content }) と同じ HTML を、ビルドのときに作る。
// 旧サイトはブラウザで splitting を動かしていた。登場の動きは .char を 1 字ずつ動かすので、構造をそろえる

type TextNode = { type: 'text'; text: string }
type ElementNode = {
  type: 'element'
  open: string
  close: string
  children: Node[]
}
type Node = TextNode | ElementNode

const escapeText = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escapeAttr = (s: string) => escapeText(s).replace(/"/g, '&quot;')

// 文言に入るタグは <a ...>...</a> だけなので、それだけを読む
export function parse(content: string): Node[] {
  const nodes: Node[] = []
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/g
  let last = 0
  for (const m of content.matchAll(re)) {
    if (m.index > last)
      nodes.push({ type: 'text', text: content.slice(last, m.index) })
    const attrs = m[1].replace(
      /\s+([\w-]+)=(?:'([^']*)'|"([^"]*)")/g,
      (_, k, a, b) => ` ${k}="${escapeAttr(a ?? b)}"`,
    )
    nodes.push({
      type: 'element',
      open: `<a${attrs}>`,
      close: '</a>',
      children: [{ type: 'text', text: m[2] }],
    })
    last = m.index + m[0].length
  }
  if (last < content.length)
    nodes.push({ type: 'text', text: content.slice(last) })
  return nodes
}

const segment = (s: string) =>
  Array.from(new Intl.Segmenter().segment(s), (x) => x.segment)

export function splitHtml(content: string): string {
  let wordIndex = 0
  let charIndex = 0

  const word = (text: string) => {
    const chars = segment(text)
      .map(
        (c) =>
          `<span class="char" data-char="${escapeAttr(c)}" style="--char-index: ${charIndex++};">${escapeText(c)}</span>`,
      )
      .join('')
    return `<span class="word" data-word="${escapeAttr(text)}" style="--word-index: ${wordIndex++};">${chars}</span>`
  }

  // splitText(el, 'word', ' ', 0, true) と同じ。前後の空白は 1 つの空白のテキストとして残る
  const walk = (nodes: Node[]): string =>
    nodes
      .map((node) => {
        if (node.type === 'element')
          return node.open + walk(node.children) + node.close
        const contents = node.text.trim()
        if (!contents.length) return ''
        const words = contents
          .split(' ')
          .map(
            (w, i) => (i ? '<span class="whitespace"> </span>' : '') + word(w),
          )
        return (
          (node.text[0] === ' ' ? ' ' : '') +
          words.join('') +
          (node.text[node.text.length - 1] === ' ' ? ' ' : '')
        )
      })
      .join('')

  const inner = walk(parse(content))
  return `<span class="words chars splitting" style="--word-total: ${wordIndex}; --char-total: ${charIndex};">${inner}</span>`
}

// 読み上げ用。タグを外した文
export const plainText = (content: string) => content.replace(/<[^>]+>/g, '')
