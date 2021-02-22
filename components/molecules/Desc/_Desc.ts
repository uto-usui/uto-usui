import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'MoleculesDesc',
  props: {
    name: { type: String, value: '' },
    value: { type: String, value: '' },
  },

  setup() {
    return {}
  },
})
