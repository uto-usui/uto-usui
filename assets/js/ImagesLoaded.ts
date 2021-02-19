/**
 *
 * @param src {string}
 * @constructor
 */
export const ImageSingleLoad = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = src
  })
}

/**
 *
 * @param array {string[]} image path
 * @constructor
 */
export const ImagesMultipleLoad = async (
  array: string[],
): Promise<HTMLImageElement[]> => {
  const res = await Promise.all(
    array.map(async (string) => {
      const img = await ImageSingleLoad(string)
      return img
    }),
  )
  return res
}

/**
 * sample code
 *
 * const loadImages = await ImagesMulchLoad(imagesArray)
 * console.log('🖼 ', loadImages)
 */
