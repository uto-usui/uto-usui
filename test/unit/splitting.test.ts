import { describe, expect, it } from 'vitest'
import { plainText, splitHtml } from '../../src/lib/splitting'

// 期待値は旧サイト（splitting 1.0.6 をブラウザで動かしたもの）の DOM から取った
describe('splitHtml', () => {
  it('語と字に分け、語の間に whitespace を入れる', () => {
    expect(splitHtml('Hello, I')).toBe(
      '<span class="words chars splitting" style="--word-total: 2; --char-total: 7;">' +
        '<span class="word" data-word="Hello," style="--word-index: 0;">' +
        '<span class="char" data-char="H" style="--char-index: 0;">H</span>' +
        '<span class="char" data-char="e" style="--char-index: 1;">e</span>' +
        '<span class="char" data-char="l" style="--char-index: 2;">l</span>' +
        '<span class="char" data-char="l" style="--char-index: 3;">l</span>' +
        '<span class="char" data-char="o" style="--char-index: 4;">o</span>' +
        '<span class="char" data-char="," style="--char-index: 5;">,</span>' +
        '</span><span class="whitespace"> </span>' +
        '<span class="word" data-word="I" style="--word-index: 1;">' +
        '<span class="char" data-char="I" style="--char-index: 6;">I</span></span></span>',
    )
  })

  it('前後の空白は whitespace ではなく、ただの空白として残す', () => {
    expect(splitHtml(' -- ')).toBe(
      '<span class="words chars splitting" style="--word-total: 1; --char-total: 2;"> ' +
        '<span class="word" data-word="--" style="--word-index: 0;">' +
        '<span class="char" data-char="-" style="--char-index: 0;">-</span>' +
        '<span class="char" data-char="-" style="--char-index: 1;">-</span></span> </span>',
    )
  })

  it('リンクの中も分け、通し番号は続ける', () => {
    const html = splitHtml(
      `blog_ <a href='https://webmanab.com/' target='_blank' data-color="#393e46">ab</a>`,
    )
    expect(html).toContain(
      '</span> <a href="https://webmanab.com/" target="_blank" data-color="#393e46">' +
        '<span class="word" data-word="ab" style="--word-index: 1;">' +
        '<span class="char" data-char="a" style="--char-index: 5;">a</span>',
    )
    expect(html).toMatch(/--word-total: 2; --char-total: 7;/)
  })

  it('属性と本文の記号をエスケープする', () => {
    expect(splitHtml(`I'm`)).toContain(
      `<span class="char" data-char="'" style="--char-index: 1;">'</span>`,
    )
    expect(splitHtml('a&b')).toContain('data-char="&amp;"')
  })
})

describe('plainText', () => {
  it('タグを外す', () => {
    expect(plainText(`clip blog_ <a href='x'>webmanab-html</a>`)).toBe(
      'clip blog_ webmanab-html',
    )
  })
})
