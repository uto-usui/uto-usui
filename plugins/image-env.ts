// type
export interface ImageEnvType {
  ready: boolean
  lazy: boolean
  webP: boolean
}

let ready = false

/**
 * Are you webP ?
 */
function canUseWebP() {
  if (process.client) {
    const elem = document.createElement('canvas')

    if (elem && elem.getContext && elem.getContext('2d')) {
      ready = true
      // was able or not to get WebP representation
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0
    }
  } else {
    return true
  }
}

/**
 * Are you lazy ?
 */
function canUseNativeLazy() {
  if (process.client) {
    return HTMLImageElement && 'loading' in HTMLImageElement.prototype
  } else {
    return true
  }
}

const getReady = () => ready

/**
 * create object
 */
function imageEnv() {
  return {
    ready: getReady(),
    lazy: canUseNativeLazy(),
    webP: canUseWebP(),
  }
}

// insert vue instance
export default (ctx, inject) => {
  ctx.$image = imageEnv()
  inject('image', imageEnv())
}
