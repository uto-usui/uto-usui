import { Actions, Getters, Mutations } from 'vuex'
import { A, G, M, S } from './type'

/**
 * state
 */
export const state = (): S => ({
  ls: null, // scroll func
  direction: 'down',
  limit: 0,
  scroll: {
    x: 0,
    y: 0,
  },
  speed: 0,
})

/**
 * getters
 */
export const getters: Getters<S, G> = {
  getLs(state, _getters, _rootState, _rootgetters) {
    return state.ls
  },
  getDirection(state, _getters, _rootState, _rootgetters) {
    return state.direction
  },
  getLimit(state, _getters, _rootState, _rootgetters) {
    return state.limit
  },
  getScroll(state, _getters, _rootState, _rootgetters) {
    return state.scroll
  },
  getSpeed(state, _getters, _rootState, _rootgetters) {
    return state.speed
  },
}

/**
 * mutations
 */
export const mutations: Mutations<S, M> = {
  ls(state, payload) {
    state.ls = payload
  },
  direction(state, payload) {
    state.direction = payload
  },
  limit(state, payload) {
    state.limit = payload
  },
  scroll(state, payload) {
    state.scroll = payload
  },
  speed(state, payload) {
    state.speed = payload
  },
}

/**
 * actions
 */
export const actions: Actions<S, A, G, M> = {
  setLs({ commit }, payload) {
    commit('ls', payload)
  },
  setDirection({ commit }, payload) {
    commit('direction', payload)
  },
  setLimit({ commit }, payload) {
    commit('limit', payload)
  },
  setScroll({ commit }, payload) {
    commit('scroll', payload)
  },
  setSpeed({ commit }, payload) {
    commit('speed', payload)
  },
}
