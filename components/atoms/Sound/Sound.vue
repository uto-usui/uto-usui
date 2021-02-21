<template>
  <div class="atom-sound">
    <div class="as__text">sound</div>
    <div class="as__border" />
  </div>
</template>

<script lang="ts" src="./_Sound.ts"></script>

<style lang="scss" scoped>
.atom-sound {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  font-style: italic;
  font-weight: 600;

  @include sizes(0);
  // opacity: 0.4;
  // border-bottom: 3px solid currentColor;
}

.as__text {
  padding-bottom: 0.5rem;
}

.as__border {
  height: 0.25rem;
  background-color: currentColor;
}
</style>
