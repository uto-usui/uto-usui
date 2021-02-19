<template>
  <div
    class="layout-default"
    :class="[
      {
        'is-ready': $state.global.isPageReady,
        'is-mobile': !$ua.isFromPc(),
      },
      `is-${$route.name}-page`,
      `is-${$ua.browser()}`,
      `is-${$ua.deviceType()}`,
      `is-${$state.global.id}`,
    ]"
  >
    <main class="ld__main">
      <nuxt />
    </main>

    <LoadSvg />
    <Debug v-if="$config.nodeEnv === 'development'" />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
} from '@vue/composition-api'
import Debug from '~/components/util/Debug.vue'
import LoadSvg from '~/components/LoadSvg.vue'

export default defineComponent({
  components: {
    Debug,
    LoadSvg,
  },
  setup(_props, ctx) {
    let animationID = 0

    const handleResize = () => {
      ctx.root.$store.dispatch('global/setWindow', {
        w: window.innerWidth,
        h: window.innerHeight,
      })
    }

    const isOpen = computed(() => {
      return ctx.root.$store.getters['global/getIsMenuOpen']
    })

    /**
     * scroll function -> requestAnimationFrame
     */
    const handleScroll = () => {
      ctx.root.$store.dispatch('global/setScrollY', window.pageYOffset)
      animationID = requestAnimationFrame(handleScroll)
    }

    /**
     * on event
     */
    const eventAttach = () => {
      window.addEventListener('resize', handleResize, false)
      //
      handleScroll()
    }

    /**
     * off event
     */
    const eventDetach = () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationID)
    }

    /**
     * life cycle
     */
    onMounted(() => {
      ctx.root.$store.dispatch('global/setScrollY', window.pageYOffset)
      ctx.root.$store.dispatch('global/setWindow', {
        w: window.innerWidth,
        h: window.innerHeight,
      })
      //
      eventAttach()
    })
    onBeforeUnmount(() => {
      eventDetach()
    })

    return {
      isOpen,
    }
  },
})
</script>

<style lang="scss" scoped>
.ld__main {
  overflow: hidden;
}
</style>

<style lang="scss">
@import '~Sass/foundation/_reset';
@import '~Sass/foundation/base/_base';
@import '~Sass/animation/_keyframes';
@import '~Sass/object/utility/_utility';

body {
  font-feature-settings: 'palt';
}

html.has-scroll-smooth {
  overflow: hidden;

  > body {
    overflow: hidden;
  }
}

@font-face {
  font-family: 'MyYuGothicM';
  font-weight: normal;
  src: local('YuGothic-Medium'), local('Yu Gothic Medium'),
    local('YuGothic-Regular');
}

@font-face {
  font-family: 'MyYuGothicM';
  font-weight: bold;
  src: local('YuGothic-Bold'), local('Yu Gothic');
}

:root {
  --fz-fluid-step--1: clamp(0.8331rem, calc(0.7798rem + 0.2669vw), 1.1rem);
  --fz-fluid-step-0: clamp(1rem, calc(0.925rem + 0.375vw), 1.375rem);
  --fz-fluid-step-1: clamp(1.2rem, calc(1.0963rem + 0.5188vw), 1.7188rem);
}
</style>
