<template>
  <div data-scroll-container class="page-home">
    <div class="ph__inner">
      <section id="OVERVIEW" class="ph__section" data-scroll-section>
        <OrganismOverview />
      </section>

      <section id="WORKS" class="ph__section" data-scroll-section>
        <OrganismWorks />
      </section>

      <section id="ABOUT" class="ph__section" data-scroll-section>
        <OrganismAbout />
      </section>

      <AtomSpace large />

      <section id="OTHER" class="ph__section" data-scroll-section>
        <OrganismOther />
      </section>

      <section id="FOOTER" class="ph__section" data-scroll-section>
        <OrganismContact />
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
} from '@vue/composition-api'
import { locomotiveInit } from '@/pages/mixins/locomotive'
import { createMetaData, headObject } from '@/pages/mixins/head'
import { useContext } from '@/components/core/getCurrentInstance'
import { animationStart } from '@/pages/mixins/animation'
import { linkColorToLine } from '@/pages/mixins/linkColor'
import { Shuffle } from '@/pages/mixins/shuffleText'

export default defineComponent({
  setup(_props, _ctx) {
    /**
     * current component instance
     */
    const { $dispatch, $getters } = useContext()
    /**
     * init locomotive
     * speed: {Number} wheel power
     */
    const { speed, resizeHandler } = locomotiveInit({})

    /**
     * fadein animation
     */
    animationStart()

    /**
     * link data-color to line
     */
    linkColorToLine()

    /**
     * shuffle text link
     */
    Shuffle()

    /**
     * create page meta object
     */
    const meta = createMetaData()

    onMounted(() => {
      nextTick(() => {
        // await ImageSingleLoad(require('Images/test/01.jpg'))
        $dispatch('global/setIsPageReady', true)

        setTimeout(() => {
          console.log(
            "$getters['ls/getLs'].value.update()",
            $getters['ls/getLs'].value.update,
          )
          $getters['ls/getLs'].value.update()
          resizeHandler()
        }, 3000)
      })
    })

    onBeforeUnmount(() => {
      $dispatch('global/setIsPageReady', false)
    })

    return {
      speed,

      ...meta,
    }
  },
  head() {
    return headObject(this)
  },
})
</script>

<style lang="scss">
.page-home {
  //
}

.ph__inner {
  //
}
</style>
