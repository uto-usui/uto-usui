/**
 * output fps
 */
export class FpsCalculator {
  public callBack: Function
  public log: boolean
  private _beginTime: number
  private _prevTime: number
  private _frames: number
  private _isRunning: boolean

  /**
   * @param callBack {Function} callback
   * @param log {Boolean} log enable
   */
  constructor({
    callBack = () => {},
    log = true,
  }: {
    callBack: Function
    log: boolean
  }) {
    this.callBack = callBack
    this.log = log

    this._beginTime = Date.now()
    this._prevTime = this._beginTime
    this._frames = 0
    this._isRunning = false
  }

  start() {
    if (this._isRunning) {
      return null
    }

    this._beginTime = Date.now()
    this._prevTime = this._beginTime
    this._frames = 0

    this._isRunning = true
    const loop = () => {
      if (!this._isRunning) {
        return null
      }
      this._update()
      requestAnimationFrame(loop)
    }
    loop()
  }

  stop() {
    this._isRunning = false
    this._frames = 0
  }

  _update() {
    this._frames++
    const prevTime = this._prevTime
    const time = Date.now()

    if (time > prevTime + 1000) {
      const fps = Math.trunc((this._frames * 1000) / (time - prevTime))

      this.log && console.log(fps)
      this.callBack(fps)

      this._prevTime = time
      this._frames = 0
    }

    this._beginTime = time
  }
}
