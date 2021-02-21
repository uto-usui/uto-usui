import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'AtomHed',
  props: {
    text: { type: String, default: 'test' },
  },

  setup() {
    return {}
  },
})
