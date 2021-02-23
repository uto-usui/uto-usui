import { defineComponent } from '@vue/composition-api'
import { viewData } from '@/data/view'

export default defineComponent({
  name: 'OrganismContact',
  props: {
    //
  },

  setup() {
    return {
      data: viewData.contact,
    }
  },
})
