import { defineComponent } from '@vue/composition-api'
import { viewData } from '@/data/view'

export default defineComponent({
  name: 'MoleculesNav',
  props: {
    //
  },

  setup() {
    return {
      list: viewData.nav,
    }
  },
})
