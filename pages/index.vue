<template>
  <div data-scroll-container class="page-home">
    <section class="ph__section" data-scroll-section>
      <TheHero />
    </section>

    <section id="LETTER" class="ph__section" data-scroll-section>
      <EditorsLetter />
    </section>

    <section
      v-for="(item, index) in articles"
      :id="item.title"
      :key="`ph__section${index}`"
      class="ph__section"
      data-scroll-section
    >
      <ArticleList :data="item" :index="index + 1" />
    </section>

    <section id="MAGAZINE" class="ph__section" data-scroll-section>
      <TheMagazine />
    </section>

    <section class="ph__section" data-scroll-section>
      <TheFooter />
    </section>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
} from '@vue/composition-api'
import { locomotiveInit } from '@/pages/mixins/locomotive'
import { createMetaData, headObject } from '@/pages/mixins/head'
import TheHero from '@/components/TheHero.vue'
import EditorsLetter from '@/components/EditorsLetter.vue'
import { Articles } from '@/data/articles'
import ArticleList from '@/components/ArticleList.vue'
import TheMagazine from '@/components/TheMagazine.vue'
import TheFooter from '@/components/TheFooter.vue'
import { ImageSingleLoad } from '@/assets/js/ImagesLoaded'

export default defineComponent({
  components: {
    TheHero,
    EditorsLetter,
    ArticleList,
    TheMagazine,
    TheFooter,
  },

  setup(_props, _ctx) {
    const articles = ref(Articles)
    /**
     * current component instance
     */
    const instance = getCurrentInstance()
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
      nextTick(async () => {
        await ImageSingleLoad(require('Images/test/02.jpg'))
        instance?.$dispatch('global/setIsPageReady', true)
      })
    })

    onBeforeUnmount(() => {
      instance?.$dispatch('global/setIsPageReady', false)
    })

    return {
      speed,
      articles,

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
