<template>
  <p class="atom-paragraph">
    <UtilSplitting v-if="split" :text="text" />
    <span v-else v-text="text"></span>
  </p>
</template>

<script lang="ts" src="./_Paragraph.ts"></script>

<style lang="scss" scoped>
.atom-paragraph {
  text-align: left;

  @include sizes(-2, 3);
}
</style>
