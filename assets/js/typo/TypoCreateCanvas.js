import * as THREE from 'three'

import { TypoScript } from './TypoScript'

export class TypoCreateCanvas {
  /**
   *
   * @param wrap {DOMElement}
   * @param video {DOMElement}
   */
  constructor({ wrap }) {
    this.scene = new THREE.Scene()
    this.container = wrap

    console.log('💄 set config', TypoScript.width(), TypoScript.height())
    this.setConfig(TypoScript.width(), TypoScript.height())

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.001, 1000)
    this.camera.position.set(0, 0, 50)
    this.camera.lookAt(this.scene.position)

    const color = new THREE.Color('#f7f8f8')

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      stencil: false,
      depth: false,
    })
    this.renderer.setClearColor(color.getHex())
    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(this.dpr)
    //
    console.log('📱 this.dpr', this.dpr)

    return this
  }

  /**
   *
   */
  appendCanvas() {
    this.container.appendChild(this.renderer.domElement)
  }

  /**
   *
   * @param width
   * @param height
   */
  setConfig(width, height) {
    this.dpr = window.devicePixelRatio
    this.width = width
    this.height = height
    this.halfWidth = this.width / 2
    this.halfHeight = this.height / 2
    this.aspectRatio = this.width / this.height

    if (this.width >= this.height) {
      this.sceneWidth = 1.5 + this.width / 2560
      this.sceneHeight = this.sceneWidth / this.aspectRatio
    } else {
      this.sceneHeight = 1.5 + this.height / 1280
      this.sceneWidth = this.sceneHeight * this.aspectRatio
    }
  }

  /**
   *
   */
  resizeScene() {
    this.camera.aspect = this.aspectRatio
    this.camera.left = -this.sceneWidth / 2
    this.camera.right = this.sceneWidth / 2
    this.camera.top = this.sceneHeight / 2
    this.camera.bottom = -this.sceneHeight / 2
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)
    //
    console.log('🔥 TypoCreateCanvas resizeScene')
  }

  /**
   *
   */
  initRenderer() {
    //
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
