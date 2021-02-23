import { computed, defineComponent, h } from '@vue/composition-api'
import {
  deliverSizeClass,
  deliverSizeClassProps,
} from '@/components/core/DeliverSizeClass'

export default defineComponent({
  name: 'AtomSpace',

  props: { ...deliverSizeClassProps },

  setup: (props, _ctx) => {
    const baseClassName = 'atom-space'
    const classes = computed(() => {
      return [baseClassName, deliverSizeClass(props, baseClassName).value]
    })

    return () =>
      h('div', {
        class: classes.value,
      })
  },
})
