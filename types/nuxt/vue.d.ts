import { UA } from 'nuxt-user-agent/lib/types'
import locomotiveScroll from 'locomotive-scroll'
import { ImageEnvType } from '@/plugins/image-env'
import { Gtag } from '@/types/nuxt/gtag'
import { GtagClickEvent } from '@/plugins/gtag.client'
import * as Vuex from 'vuex'

declare module '@nuxt/vue-app' {
  interface Context {
    $ua: UA
    $mq: string
    $image: ImageEnvType
    $locomotiveScroll: locomotiveScroll

    $gtag: Gtag
    $gtagClickEvent: GtagClickEvent

    $exStore: Vuex.ExStore
    $state: Vuex.ExStore['state']
    $getters: Vuex.ExStore['getters']
    $commit: Vuex.ExStore['commit']
    $dispatch: Vuex.ExStore['dispatch']
  }
}

declare module '@nuxt/types' {
  interface Context {
    $ua: UA
    $mq: string
    $image: ImageEnvType
    $locomotiveScroll: locomotiveScroll

    $gtag: Gtag
    $gtagClickEvent: GtagClickEvent

    $exStore: Vuex.ExStore
    $state: Vuex.ExStore['state']
    $getters: Vuex.ExStore['getters']
    $commit: Vuex.ExStore['commit']
    $dispatch: Vuex.ExStore['dispatch']
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $ua: UA
    $mq: string
    $image: ImageEnvType
    $locomotiveScroll: locomotiveScroll

    $gtag: Gtag
    $gtagClickEvent: GtagClickEvent

    $exStore: Vuex.ExStore
    $state: Vuex.ExStore['state']
    $getters: Vuex.ExStore['getters']
    $commit: Vuex.ExStore['commit']
    $dispatch: Vuex.ExStore['dispatch']
  }
}

declare module 'vuex' {
  interface Store<S> {
    $ua: UA
    $mq: string
    $image: ImageEnvType
    $locomotiveScroll: locomotiveScroll

    $gtag: Gtag
    $gtagClickEvent: GtagClickEvent

    $exStore: Vuex.ExStore
    $state: Vuex.ExStore['state']
    $getters: Vuex.ExStore['getters']
    $commit: Vuex.ExStore['commit']
    $dispatch: Vuex.ExStore['dispatch']
  }
}
