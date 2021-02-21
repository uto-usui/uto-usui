import { computed, defineComponent } from '@vue/composition-api'
import { viewData } from '@/data/view'

export default defineComponent({
  name: 'OrganismOverview',
  props: {
    //
  },

  setup() {
    /**
     * links dom
     * @return {string[]}
     */
    const links = computed(() => {
      return viewData.overview.links.map((el) => {
        return `${el.title}<a href='${el.link}' target='_blank'>${el.name}</a>`
      })
    })

    return {
      data: viewData.overview,
      links,
    }
  },
})
