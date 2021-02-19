/**
 * create page head meta information
 */
import { meta } from '@/data/info'

export type MetaData = {
  title?: string
  description?: string
  keywords?: string
  ogImg?: string
  ogType?: string
  fbText?: string
  url?: string
}

/**
 * for setup() object
 */
export const createMetaData = (data: MetaData = {}) => {
  return { ...meta, ...data }
}

/**
 * for head() object
 */
export const headObject = (_this) => {
  return {
    title: _this.title || meta.title,
    meta: [
      {
        hid: 'keywords',
        name: 'keywords',
        content: _this.keywords || meta.keywords,
      },
      {
        hid: 'description',
        name: 'description',
        content: _this.description || meta.description,
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: _this.title || meta.title,
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: _this.description || meta.description,
      },
      { hid: 'og:locale', property: 'og:locale', content: 'ja_JP' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'uto_ao' },
      {
        hid: 'og:type',
        property: 'og:type',
        content: _this.ogType || meta.ogType,
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content:
          _this.$route.fullPath === '/'
            ? meta.url
            : meta.url + _this.url || _this.$route.fullPath,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: _this.ogImg || meta.ogImg,
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: _this.title || meta.title,
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: _this.description || meta.description,
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: _this.ogImg || meta.ogImg,
      },
      {
        hid: 'twitter:site',
        name: 'twitter:site',
        content: 'uto_ao',
      },
    ],
  }
}
