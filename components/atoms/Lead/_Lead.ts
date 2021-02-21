import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'AtomLead',
  props: {
    text: { type: String, default: '' },
    split: { type: Boolean, default: false },
  },

  setup() {
    return {}
  },
})
