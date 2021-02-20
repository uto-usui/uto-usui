<template>
  <div data-scroll-container class="page-home">
    <section class="ph__section" data-scroll-section>...</section>

    <section id="LETTER" class="ph__section" data-scroll-section>...</section>

    <section class="ph__section" data-scroll-section>...</section>
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

export default defineComponent({
  components: {},

  setup(_props, _ctx) {
    /**
     * current component instance
     */
    const { $dispatch } = useContext()
    /**
     * init locomotive
     * speed: {Number} wheel power
     */
    const { speed } = locomotiveInit({})

    /**
     * create page meta object
     */
    const meta = createMetaData()

    onMounted(() => {
      nextTick(() => {
        // await ImageSingleLoad(require('Images/test/01.jpg'))
        $dispatch('global/setIsPageReady', true)
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

<style lang="scss" scoped>
.page-home {
  width: 100%;
}

.ph__section {
  //
}
</style>
