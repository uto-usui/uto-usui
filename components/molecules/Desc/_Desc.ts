import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'MoleculesDesc',
  props: {
    name: { type: String, default: '' },
    value: { type: String, default: '' },
  },

  setup() {
    return {}
  },
})
