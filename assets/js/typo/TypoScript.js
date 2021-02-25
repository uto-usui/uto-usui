// import { pause } from '~/assets/js/animation'

let _this = null

export class TypoScript {
  /**
   *
   * @param wrap {DOMElement}
   * @param video {DOMElement}
   */
  constructor() {
    this.width = 0
    this.height = 0
    this.halfWidth = 0
    this.halfHeight = 0
    this.functions = []
    this.functionsLength = 0
    this.isWaiting = false

    this.container = window

    this.init()
    return this
  }

  /**
   *
   */
  init() {
    window.addEventListener('resize', this.onResize.bind(this))
    this.onResize()
  }

  /**
   *
   * @param func
   * @param isInitPlay
   */
  add(func, isInitPlay) {
    this.functions.push(func)
    this.functionsLength = this.functions.length
    isInitPlay && func(this.width, this.height, this.halfWidth, this.halfHeight)
  }

  /**
   *
   * @param func
   */
  remove(func) {
    for (let i = 0; i < this.functionsLength; i++) {
      if (this.functions[i] === func) {
        this.functions.splice(i, 1)
        break
      }
    }

    this.functionsLength = this.functions.length
  }

  /**
   *
   * @param e
   * @returns {*}
   */
  onResize(_e) {
    //    await pause(1)
    //
    this.width =
      this.container === window ? window.innerWidth : this.container.offsetWidth
    this.height =
      this.container === window
        ? window.innerHeight
        : this.container.offsetHeight
    this.halfWidth = this.width / 2
    this.halfHeight = this.height / 2

    //
    this.dpr = window.devicePixelRatio
    this.aspectRatio = this.width / this.height

    if (this.width >= this.height) {
      this.sceneWidth = 1.5 + this.width / 2560
      this.sceneHeight = this.sceneWidth / this.aspectRatio
    } else {
      this.sceneHeight = 1.5 + this.height / 1280
      this.sceneWidth = this.sceneHeight * this.aspectRatio
    }

    this.isWaiting = false

    for (let i = 0; i < this.functionsLength; i++) {
      this.functions[i](
        this.width,
        this.height,
        this.halfWidth,
        this.halfHeight,
      )
    }
  }

  static getInstance() {
    return _this || (_this = new TypoScript())
  }

  static add(t, ...n) {
    this.getInstance().add(t, n)
  }

  static remove(t) {
    this.getInstance().remove(t)
  }

  static width() {
    return this.getInstance().width
  }

  static height() {
    return this.getInstance().height
  }

  static sceneWidth() {
    return this.getInstance().sceneWidth
  }

  static sceneHeight() {
    return this.getInstance().sceneHeight
  }

  static dpr() {
    return this.getInstance().dpr
  }

  destroy() {
    //    this.trackballControls.dispose()
    //
    //    this.scene.remove(this.mesh)
    //    this.geometry.dispose()
    //    this.material.dispose()
    //
    //    this.renderer.domElement = null
  }
}
