import { VueConstructor } from 'vue'
import { getCurrentInstance as getVM, computed } from '@vue/composition-api'

import type { Ref } from '@vue/composition-api'
import type { Context } from '@nuxt/types'
import type { Route } from 'vue-router'

export const globalNuxt = '<%= options.globalNuxt %>'.includes('options')
  ? '$nuxt'
  : ('<%= options.globalNuxt %>' as '$nuxt')

export function getCurrentInstance() {
  const vm = getVM()

  if (!vm) return

  return vm.proxy as InstanceType<VueConstructor>
}

// from https://github.com/nuxt-community/composition-api/blob/main/src/context.ts

interface UseContextReturn
  extends Omit<Context, 'route' | 'query' | 'from' | 'params'> {
  route: Ref<Route>
  query: Ref<Route['query']>
  from: Ref<Route['redirectedFrom']>
  params: Ref<Route['params']>
}

/**
 * `useContext` will return the Nuxt context.
 * @example
 ```ts
 import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'
 export default defineComponent({
    setup() {
      const { store } = useContext()
      store.dispatch('myAction')
    },
  })
 ```
 */
export const useContext = (): UseContextReturn => {
  const vm = getCurrentInstance()
  if (!vm) throw new Error('This must be called within a setup function.')

  return {
    ...(vm[globalNuxt] || vm.$options).context,
    route: computed(() => vm.$route),
    query: computed(() => vm.$route.query),
    from: computed(() => vm.$route.redirectedFrom),
    params: computed(() => vm.$route.params),
  }
}
