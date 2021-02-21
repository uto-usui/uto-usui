import { defineComponent } from '@vue/composition-api'
import { viewData } from '@/data/view'

export default defineComponent({
  name: 'MoleculesOverview',
  props: {
    //
  },

  setup() {
    return {
      list: viewData.works,
    }
  },
})
