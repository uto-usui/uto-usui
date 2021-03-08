import { Plugin } from '@nuxt/types'
import * as Vuex from 'vuex'

class ExStore {
  store: Vuex.ExStore

  constructor(store) {
    this.store = store
  }

  getStore() {
    return this.store
  }

  state() {
    return this.store.state
  }

  getters() {
    return this.store.getters
  }

  commit() {
    return this.store.commit
  }

  dispatch() {
    return this.store.dispatch
  }
}

const plugin: Plugin = (context, inject) => {
  const store = new ExStore(context.store)

  inject('exStore', store.getStore())
  inject('state', store.state())
  inject('getters', store.getters())
  inject('commit', store.commit())
  inject('dispatch', store.dispatch())
}

export default plugin
