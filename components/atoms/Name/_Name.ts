import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'AtomName',
  props: {
    text: { type: String, default: '' },
  },

  setup() {
    return {}
  },
})
