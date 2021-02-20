import { Plugin } from '@nuxt/types'

import locomotiveScroll from 'locomotive-scroll'
import 'locomotive-scroll/dist/locomotive-scroll.min.css'

const plugin: Plugin = (context, inject) => {
  context.$locomotiveScroll = locomotiveScroll
  inject('locomotiveScroll', locomotiveScroll)
}

export default plugin
