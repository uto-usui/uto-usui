import { defineComponent } from '@vue/composition-api'
import { viewData } from '@/data/view'

export default defineComponent({
  name: 'MoleculesOther',
  props: {
    //
  },

  setup() {
    return {
      list: viewData.other,
    }
  },
})
