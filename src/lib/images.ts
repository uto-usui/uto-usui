import type { ImageMetadata } from 'astro'

const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/**/*.jpg',
  { eager: true },
)

// data/view.ts の 'wired/1.jpg' のような名前から、画像を引く
export function image(name: string): ImageMetadata {
  const found = modules[`../assets/images/${name}`]
  if (!found) throw new Error(`画像が見つかりません: ${name}`)
  return found.default
}
