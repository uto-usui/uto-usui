<template>
  <div id="js-loader" class="atom-loader">
    <div v-for="(item, index) in 3" :key="index + item" class="al__item" />
  </div>
</template>

<script lang="ts" src="./_Loader.ts"></script>

<style lang="scss" scoped>
.atom-loader {
  @include overlay;
}

.al__item {
  --loader-size: 3.75rem;
  --loader-gap: 0.25rem;

  @include desktop {
    --loader-size: 6.25rem;
    --loader-gap: 0.5rem;
  }

  position: absolute;
  width: var(--loader-size);
  height: var(--loader-size);
  mix-blend-mode: color;
  animation: rotate 1s linear infinite;
  //
  &:nth-child(1) {
    top: calc(50% - var(--loader-size) / 2);
    left: calc(50% - var(--loader-size) / 2);
    z-index: 5;
    background-color: rgba($color-primary, 0.8);
    border-radius: 48% / 45%;
    animation-duration: 0.5s;
  }

  &:nth-child(2) {
    top: calc(50% - var(--loader-size) / 2 + var(--loader-gap));
    left: calc(50% - var(--loader-size) / 2 - var(--loader-gap));
    z-index: 4;
    background-color: rgba($color-sky, 0.8);
    border-radius: 49% / 46%;
    animation-duration: 0.8s;
  }

  &:nth-child(3) {
    top: calc(50% - var(--loader-size) / 2 - var(--loader-gap));
    left: calc(50% - var(--loader-size) / 2 + var(--loader-gap));
    z-index: 3;
    background-color: rgba($color-yellow, 0.8);
    border-radius: 46% / 48%;
    animation-duration: 1.3s;
  }
}
</style>
