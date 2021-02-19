import {
  computed,
  defineComponent,
  PropType,
  h,
  getCurrentInstance,
} from '@vue/composition-api'

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

  setup(props, _ctx) {
    const $image = getCurrentInstance()?.$store?.$image

    const getSize = computed(() => {
      return {
        paddingTop: `calc(100% * ${props.pictureHeight} / ${props.pictureWidth} / 2)`,
        paddingBottom: `calc(100% * ${props.pictureHeight} / ${props.pictureWidth} / 2)`,
      }
    })

    const isWebP = computed(() => props.isWebP && $image?.webP)

    const replaceWebP = (string: string) => {
      return string ? string.replace(/\.jpg/g, '.webp') : ''
    }

    const directives =
      $image?.ready && !$image?.lazy && props.isLazyScript
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
                ($image?.ready && $image.lazy) || !props.isLazyScript
                  ? isWebP.value
                    ? replaceWebP(props.pictureSrc)
                    : props.pictureSrc
                  : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
              srcset:
                (props.pictureSrcset && $image?.ready && $image.lazy) ||
                !props.isLazyScript
                  ? isWebP.value
                    ? replaceWebP(props.pictureSrcset)
                    : props.pictureSrcset
                  : undefined,
              // If not native lazy env, ignore replaceWebP
              'data-srcset':
                !$image?.lazy && props.isLazyScript
                  ? props.pictureSrcset
                  : undefined,
              alt: props.pictureAlt,
              loading: $image?.lazy ? 'lazy' : undefined,
            },
            directives,
            staticClass: 'tp__img',
          }),
        ],
      )
  },
})
