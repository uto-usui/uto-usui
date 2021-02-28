<template>
  <h2 class="atom-title" v-text="text" />
</template>

<script lang="ts" src="./_Title.ts"></script>

<style lang="scss" scoped>
.atom-title {
  font-style: italic;
  font-weight: 700;
  text-align: right;
  text-shadow: 0.5em 0.25em 0 $color-yellow;
  backface-visibility: hidden;

  @include sizes(6);

  @include desktop {
    @include sizes(7);
  }
}
</style>
