import { defineComponent } from '@vue/composition-api'
import { viewData } from '@/data/view'

export default defineComponent({
  name: 'MoleculesAbout',
  props: {
    //
  },

  setup() {
    return {
      data: viewData.about,
    }
  },
})
