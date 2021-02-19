interface windowType {
  w: number
  h: number
}

/**
 * state
 */
export interface S {
  isPageReady: boolean
  isMenuOpen: boolean
  pageName: string
  window: windowType
  scrollY: number
  id: string
}

/**
 * getters
 */
export interface G {
  getIsMenuOpen: boolean
  getId: string
}
export interface RG {
  'global/getIsMenuOpen': G['getIsMenuOpen']
  'global/getId': G['getId']
}

/**
 * mutations
 */
export interface M {
  isPageReady: boolean
  isMenuOpen: boolean
  pageName: string
  window: windowType
  scrollY: number
  id: string
}
export interface RM {
  'global/isPageReady': M['isPageReady']
  'global/isMenuOpen': M['isMenuOpen']
  'global/pageName': M['pageName']
  'global/window': M['window']
  'global/scrollY': M['scrollY']
  'global/id': M['id']
}

/**
 * actions
 */
export interface A {
  setIsPageReady: boolean
  setIsMenuOpen: boolean
  setPageName: string
  setWindow: windowType
  setScrollY: number
  setId: string
}
export interface RA {
  'global/setIsPageReady': A['setIsPageReady']
  'global/setIsMenuOpen': A['setIsMenuOpen']
  'global/setPageName': A['setPageName']
  'global/setWindow': A['setWindow']
  'global/setScrollY': A['setScrollY']
  'global/setId': A['setId']
}
