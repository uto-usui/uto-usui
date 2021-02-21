<template>
  <p class="atom-lead">
    <UtilSplitting v-if="split" :text="text" />
    <span v-else v-text="text"></span>
  </p>
</template>

<script lang="ts" src="./_Lead.ts"></script>

<style lang="scss" scoped>
.atom-lead {
  font-style: italic;
  font-weight: 700;
  text-align: left;

  @include sizes(2);

  @include desktop {
    @include sizes(3);
  }
}
</style>
