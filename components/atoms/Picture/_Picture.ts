import { computed, defineComponent, PropType, h } from '@vue/composition-api'

// import { srcSetPoints } from '~/assets/js/info'

export const ThePictureProps = {
  pictureSrc: {
    type: String,
    default: '',
  },

  srcSetItems: {
    type: Array as PropType<string[]>,
    default: () => [],
  },

  pictureSrcset: {
    type: String,
    default: '',
  },

  isWebP: {
    type: Boolean,
    default: false,
  },

  isLazyScript: {
    type: Boolean,
    default: true,
  },

  pictureWidth: {
    type: [String, Number, Boolean],
    default: 3,
  },
  pictureHeight: {
    type: [String, Number, Boolean],
    default: 4,
  },

  pictureAlt: {
    type: String,
    default: '',
  },

  pictureTag: {
    type: String,
    default: 'div',
  },
}

export default defineComponent({
  name: 'ThePicture',

  props: ThePictureProps,

  setup(props, { root }) {
    // const _getSrcSet = computed(() => {
    //   if (props.srcSetItems[0]) {
    //     return props.srcSetItems.reduce((prev, current, i) => {
    //       if (i === 1) {
    //         return `${prev} ${srcSetPoints[i - 1]}, ${current} ${
    //           srcSetPoints[i]
    //         },`
    //       }
    //       return `${prev} ${current} ${srcSetPoints[i - 1]},`
    //     })
    //   } else {
    //     return []
    //   }
    // })

    const getSize = computed(() => {
      return {
        paddingTop: `calc(100% * ${props.pictureHeight} / ${props.pictureWidth} / 2)`,
        paddingBottom: `calc(100% * ${props.pictureHeight} / ${props.pictureWidth} / 2)`,
      }
    })

    const isWebP = computed(() => props.isWebP && root.$image.webP)

    const replaceWebP = (string: string) => {
      return string ? string.replace(/\.jpg/g, '.webp') : ''
    }

    const directives =
      root.$image.ready && !root.$image.lazy && props.isLazyScript
        ? [
            {
              name: 'lazy',
              value: props.pictureSrc,
            },
          ]
        : undefined

    return () =>
      h(
        props.pictureTag,
        {
          staticClass: 'the-picture',
          style: getSize.value,
        },
        [
          h('img', {
            attrs: {
              src:
                (root.$image.ready && root.$image.lazy) || !props.isLazyScript
                  ? isWebP.value
                    ? replaceWebP(props.pictureSrc)
                    : props.pictureSrc
                  : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
              srcset:
                (props.pictureSrcset &&
                  root.$image.ready &&
                  root.$image.lazy) ||
                !props.isLazyScript
                  ? isWebP.value
                    ? replaceWebP(props.pictureSrcset)
                    : props.pictureSrcset
                  : undefined,
              // If not native lazy env, ignore replaceWebP
              'data-srcset':
                !root.$image.lazy && props.isLazyScript
                  ? props.pictureSrcset
                  : undefined,
              alt: props.pictureAlt,
              loading: root.$image.lazy ? 'lazy' : undefined,
            },
            directives,
            staticClass: 'tp__img',
          }),
        ],
      )
  },
})
