interface ScrollObj {
  x: number
  y: number
}
/**
 * state
 */
export interface S {
  ls: any
  direction: string
  limit: number
  scroll: ScrollObj
  speed: number
}

/**
 * getters
 */
export interface G {
  getLs: any
  getDirection: string
  getLimit: number
  getScroll: ScrollObj
  getSpeed: number
}
export interface RG {
  'ls/getLs': G['getLs']
  'ls/getDirection': G['getDirection']
  'ls/getLimit': G['getLimit']
  'ls/getScroll': G['getScroll']
  'ls/getSpeed': G['getSpeed']
}

/**
 * mutations
 */
export interface M {
  ls: any
  direction: string
  limit: number
  scroll: ScrollObj
  speed: number
}
export interface RM {
  'ls/ls': M['ls']
  'ls/direction': M['direction']
  'ls/limit': M['limit']
  'ls/scroll': M['scroll']
  'ls/speed': M['speed']
}

/**
 * actions
 */
export interface A {
  setLs: any
  setDirection: string
  setLimit: number
  setScroll: ScrollObj
  setSpeed: number
}
export interface RA {
  'ls/setLs': A['setLs']
  'ls/setDirection': A['setDirection']
  'ls/setLimit': A['setLimit']
  'ls/setScroll': A['setScroll']
  'ls/setSpeed': A['setSpeed']
}
