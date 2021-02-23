import { computed } from '@vue/composition-api'

/**
 * This is the object
 * you need to pass to props in the component you want to apply
 */
export const deliverSizeClassProps = {
  xSmall: {
    type: Boolean,
    default: false,
  },
  small: {
    type: Boolean,
    default: false,
  },
  large: {
    type: Boolean,
    default: false,
  },
  xLarge: {
    type: Boolean,
    default: false,
  },
}

export function deliverSizeClass(
  props: typeof deliverSizeClassProps | any,
  className: string,
) {
  const medium = computed(() =>
    Boolean(!props.xSmall && !props.small && !props.large && !props.xLarge),
  )

  return computed((): { [k: string]: boolean } => {
    return {
      [`${className}--x-small`]: props.xSmall,
      [`${className}--small`]: props.small,
      [`${className}--medium`]: medium.value,
      [`${className}--large`]: props.large,
      [`${className}--x-large`]: props.xLarge,
    }
  })
}
