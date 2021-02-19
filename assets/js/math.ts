/**
 * 配列をシャフルする
 * @param arr {number}
 *
 * @return {*[]}
 */
export const shuffle = ([...arr]) => {
  const array = [...arr]
  let m = array.length
  while (m) {
    const i = Math.floor(Math.random() * m--)
    ;[array[m], array[i]] = [array[i], array[m]]
  }
  return array
}

/**
 * 線形補間 0から1のまでの値を、任意の範囲に相当する値に変換する。
 * @param x {number} start
 * @param y {number} end
 * @param p {number} value
 *
 * @returns {number} area value from start to end
 */
export const lerp = (x: number, y: number, p: number) => x + (y - x) * p

/**
 * ノーマライズ 任意の範囲のある値を、0から1の範囲の値に変換する。
 * @param x {number} start
 * @param y {number} end
 * @param p {number} value
 *
 * @returns {number} area value from 0 to 1
 */
export const norm = (x: number, y: number, p: number) => (p - x) / (y - x)

/**
 * 新しい範囲における現在の値を、現在の範囲を元に変換して返す
 * map(a, b, c, d, e)   aを範囲b-cから別の範囲d-eへ変換する
 * @param value {number}
 * @param fromMin {number} 変換前の最小
 * @param fromMax {number} 変換前の最大
 * @param toMin {number} 変換後の最小
 * @param toMax {number} 変換後の最大
 *
 * @returns {number} area value from toMin to toMax
 */
export const map = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
) => {
  let result = 0

  result =
    value <= fromMin
      ? toMin
      : value >= fromMax
      ? toMax
      : (() => {
          const ratio = (toMax - toMin) / (fromMax - fromMin)
          return (value - fromMin) * ratio + toMin
        })()

  return result
}

/**
 * ２点間の距離を求める
 * @param x0 {number}
 * @param y0 {number}
 * @param x1 {number}
 * @param y1 {number}
 * @returns {number}
 */
export const distance = (x0: number, y0: number, x1: number, y1: number) =>
  Math.hypot(x1 - x0, y1 - y0)

/**
 * 最小値と最大値を指定したランダムな値を返す
 * @param min {number}
 * @param max {number}
 * @returns {number}
 */
export const random = (min: number, max: number) =>
  Math.random() * (max - min) + min

/**
 * 最小値と最大値を指定したランダムな整数値を返す
 * @param min {number}
 * @param max {number}
 * @returns {number}
 */
export const randomInt = (min: number, max: number) =>
  Math.trunc(Math.random() * (max - min + 1)) + min

/**
 *
 * @param min
 * @param max
 * @returns {number}
 */
export const randRange = (min: number, max: number) =>
  Math.random() * (max - min + 1) + min

/**
 * ランダムに配列内の要素を返す
 * @param arr {array}
 * @returns {*}
 */
export const randomArr = (arr: any[]) => arr[randomInt(0, arr.length - 1)]

/**
 * range の確率で true を返す
 * @param range
 * @returns {boolean}
 */
export const rangeBoolean = (range: number): boolean =>
  randomInt(0, range - 1) === 0

/**
 * min ~ max に value が当てはまるとき 0 ~ 1 を返す
 * @param min {number} 0以上の値s
 * @param max {number}
 * @param value {number}
 * @returns {number}
 */
export const aperture = (min: number, max: number, value: number) =>
  (value - (max - min)) / min

/**
 * 任意の桁でまるめる関数
 * @param value {number} 切り上げする数値
 * @param base {number} どの桁で切り上げするか（10→10の位、0.1→小数第１位）
 * @return {number} 切り上げした値
 */
export const orgTrunc = (value: number, base: number) =>
  Math.trunc(value * base) / base
