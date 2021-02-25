import { CanvasTexture, PlaneGeometry, ShaderMaterial } from 'three'

import vs from './TypoFontTexture.vs'
import fs from './TypoFontTexture.fs'
import { TypoScript } from './TypoScript'

// import { OpeningSvg } from './openingSvg'

export class TypoFontTexture {
  constructor(img) {
    this.texture = null
    this.textureW = 0
    this.textureH = 0
    this.textureX = 0
    this.textureY = 0

    this.img = img

    this.init()

    this.material = new ShaderMaterial({
      uniforms: {
        u_texture: {
          type: 't',
          value: this.texture,
        },
        time: {
          type: 'f',
          value: 0,
        },
        seed: {
          type: 'f',
          value: 1000 * Math.random(),
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
    })

    return this
  }

  init() {
    this.createFontTexture({
      size: 2048,
    })

    this.resize()
  }

  /**
   *
   * @param fontSize
   * @param _size
   */
  createFontTexture({ size: _size }) {
    const canvas = document.createElement('canvas')
    const size = _size * 1
    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext('2d')

    this.textureW = (size * this.img.width) / TypoScript.width()
    this.textureH = (size * this.img.height) / TypoScript.width()
    this.textureX = size / 2 - this.textureW / 2
    this.textureY = size / 2 - this.textureH / 2

    ctx.drawImage(
      this.img,
      this.textureX,
      this.textureY,
      this.textureW,
      this.textureH,
    )

    const texture = new CanvasTexture(canvas)
    texture.needsUpdate = false

    this.texture = texture
  }

  /**
   *
   */
  resize() {
    const size =
      0.8 * Math.max(TypoScript.sceneWidth(), TypoScript.sceneHeight())
    this.geometry = new PlaneGeometry(size, size, 1, 1)
  }

  /**
   *
   * @param time
   */
  update(time = 0.1) {
    //    console.log('🔥 this.material', this.material.uniforms.time.value)
    this.material.uniforms.time.value = time
  }
}
