import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'AtomHed',
  props: {
    text: { type: String, default: '' },
    split: { type: Boolean, default: false },
  },

  setup() {
    return {}
  },
})
