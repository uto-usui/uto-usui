<template>
  <button
    id="js-sound"
    class="atom-sound"
    :class="[{ 'is-play': isPlay }]"
    @click="isPlay = !isPlay"
  >
    <span class="as__text">sound</span>
    <span class="as__border" />
  </button>
</template>

<script lang="ts" src="./_Sound.ts"></script>

<style lang="scss" scoped>
.atom-sound {
  display: block;
  font-style: italic;
  font-weight: 600;
  opacity: 0.4;

  @include sizes(0);

  &.is-play {
    opacity: 1;
  }
}

.as__text {
  display: block;
  padding-bottom: 0.5rem;
}

.as__border {
  display: block;
  height: 0.25rem;
  background-color: currentColor;
}
</style>
