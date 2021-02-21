<template>
  <p class="atom-tag" v-text="text" />
</template>

<script lang="ts" src="./_Tag.ts"></script>

<style lang="scss" scoped>
.atom-tag {
  display: inline-block;
  font-style: italic;
  letter-spacing: 0.05rem;
  border-top: 1px solid currentColor;
  border-bottom: 1px solid currentColor;

  @include sizes(-2, 3);
}
</style>
