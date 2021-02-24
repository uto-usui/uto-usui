import { Getters, Mutations, Actions } from 'vuex'
import { S, G, M, A } from './type'

/**
 * state
 */
export const state = (): S => ({
  isPageReady: false,
  isMenuOpen: false,
  pageName: '',
  window: {
    w: 0,
    h: 0,
  },
  scrollY: 0,
  id: 'to',
})

/**
 * getters
 */
export const getters: Getters<S, G> = {
  getIsPageReady(state, _getters, _rootState, _rootgetters) {
    return state.isPageReady
  },

  getIsMenuOpen(state, _getters, _rootState, _rootgetters) {
    return state.isMenuOpen
  },

  getId(state, _getters, _rootState, _rootgetters) {
    return state.id
  },

  getWindow(state, _getters, _rootState, _rootgetters) {
    return state.window
  },
}

/**
 * mutations
 */
export const mutations: Mutations<S, M> = {
  isPageReady(state, payload) {
    state.isPageReady = payload
  },
  isMenuOpen(state, payload) {
    state.isMenuOpen = payload
  },
  pageName(state, payload) {
    state.pageName = payload
  },
  window(state, payload) {
    state.window = payload
  },
  scrollY(state, payload) {
    state.scrollY = payload
  },
  id(state, payload) {
    state.id = payload
  },
}

/**
 * actions
 */
export const actions: Actions<S, A, G, M> = {
  setIsPageReady({ commit }, payload) {
    commit('isPageReady', payload)
  },
  setIsMenuOpen({ commit }, payload) {
    commit('isMenuOpen', payload)
  },
  setPageName({ commit }, payload) {
    commit('pageName', payload)
  },
  setWindow({ commit }, payload) {
    commit('window', payload)
  },
  setScrollY({ commit }, payload) {
    commit('scrollY', payload)
  },
  setId({ commit }, payload) {
    commit('id', payload)
  },
}
