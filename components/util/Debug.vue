<template>
  <div class="debug">
    fps : {{ fps }} / w :
    {{ $store.state.global.window && $store.state.global.window.w }} / h :
    {{ $store.state.global.window && $store.state.global.window.h }} / s :
    {{ $store.state.global.scrollY }}
  </div>
</template>

<script lang="ts">
import vue from 'vue'
import { FpsCalculator } from '@/assets/js/FpsCalculator'

export default vue.extend({
  name: 'Debug',
  data: () => ({
    fps: 0,
  }),
  computed: {
    //
  },
  watch: {
    getPageReady(value) {
      console.log('getPageReady getPageReady getPageReady', value)
    },
  },
  mounted() {
    this.fpsCalc()
  },
  methods: {
    fpsCalc() {
      const fps = new FpsCalculator({
        callBack: this.setFps,
        log: false,
      })
      fps.start()
    },
    setFps(val: number) {
      this.fps = val
    },
  },
})
</script>

<style lang="scss" scoped>
.debug {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 9999;
  padding-right: 15px;
  padding-left: 15px;
  font-weight: bold;
  color: rgba($color-black, 0.5);
  background-color: rgba($color-white, 0.5);
  //
  @include tablet {
    //
  }
  //
  &::after,
  &::before {
    position: fixed;
    top: calc(50% - 1px);
    display: none;
    height: 2px;
    content: '';
    background-color: rgba($color-black, 0.1);
  }
  //
  &::after {
    left: 0;
    width: 100vw;
  }
  //
  &::before {
    left: 50%;
    width: 100vh;
    transform: translateX(-50%) rotate(90deg);
  }
}
</style>
