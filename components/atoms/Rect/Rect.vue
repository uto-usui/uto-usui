<template>
  <div class="atom-rect" />
</template>

<script lang="ts" src="./_Rect.ts"></script>

<style lang="scss" scoped>
.atom-rect {
  @include overlay;

  padding: 2.25rem;
  background: linear-gradient(to bottom, #e1e6ec 0%, #f0f4f7 100%),
    linear-gradient(to bottom, #e1e6ec 0%, #f0f4f7 100%);
}
</style>
