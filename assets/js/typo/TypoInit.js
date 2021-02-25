// import * as THREE from 'three'

import { Mesh } from 'three'
import { TypoScript } from './TypoScript'
import { TypoFontTexture } from './TypoFontTexture'
import { TypoCreateCanvas } from './TypoCreateCanvas'

export class TypoInit extends TypoCreateCanvas {
  /**
   *
   * @returns {TypoInit}
   */
  constructor({ wrap, img }) {
    super({ wrap })
    //
    this.resizeFunction = this.resize.bind(this)
    this.title = new TypoFontTexture(img)
    this.meth = new Mesh(this.title.geometry, this.title.material)
    this.scene.add(this.meth)

    //    console.log(this.title.geometry, this.title.material)
    //
    return this
  }

  start() {
    this.appendCanvas()
    TypoScript.add(this.resizeFunction)
  }

  finish() {
    TypoScript.remove(this.resizeFunction)
    this.renderer.dispose()
    //
    console.log('🔥 finish TypoScript')
  }

  resize(width, height) {
    this.needsStopUpdate = true
    this.setConfig(width, height)
    this.title.resize()
    this.resizeScene()
    this.needsStopUpdate = false
    //
    console.log('🔥 TypoInit resize')
  }

  update() {
    //    console.log('this.needsStopUpdate', !this.needsStopUpdate)
    if (!this.needsStopUpdate) {
      const time = 0.001 * performance.now()
      this.title.update(time)
      this.renderer.render(this.scene, this.camera)
    }
  }

  destroy() {
    //
  }
}
