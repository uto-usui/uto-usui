import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'MoleculesFigures',
  props: {
    name: { type: String, default: 'default' },
    images: { type: Array, default: () => [] },
  },

  setup() {
    return {
      //
    }
  },
})
