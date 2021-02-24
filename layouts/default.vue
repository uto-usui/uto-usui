<template>
  <div
    class="layout-default"
    :class="[
      {
        'is-ready': $getters['global/getIsPageReady'],
        'is-mobile': !$ua.isFromPc(),
      },
      `is-${$route.name}-page`,
      `is-${$ua.browser()}`,
      `is-${$ua.deviceType()}`,
      `is-${$state.global.id}`,
    ]"
  >
    <OrganismFixed />

    <main id="main" class="ld__main">
      <nuxt />
    </main>

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
import { useContext } from '@/components/core/getCurrentInstance'
import Debug from '~/components/util/Debug.vue'

export default defineComponent({
  components: {
    Debug,
  },
  setup(_props, _ctx) {
    const { $dispatch, $getters } = useContext()
    let animationID = 0

    const handleResize = () => {
      $dispatch('global/setWindow', {
        w: window.innerWidth,
        h: window.innerHeight,
      })
    }

    const isOpen = computed(() => {
      return $getters['global/getIsMenuOpen']
    })

    /**
     * scroll function -> requestAnimationFrame
     */
    const handleScroll = () => {
      $dispatch('global/setScrollY', window.pageYOffset)
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
      $dispatch('global/setScrollY', window.pageYOffset)
      $dispatch('global/setWindow', {
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
  opacity: 0;
}
</style>

<style lang="scss">
@import '~Sass/foundation/_reset';
@import '~Sass/foundation/base/_base';
@import '~Sass/animation/_keyframes';
@import '~Sass/object/utility/';

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
