<template>
  <div class="atom-line">
    <div class="ar__border"></div>
  </div>
</template>

<script lang="ts" src="./_Line.ts"></script>

<style lang="scss" scoped>
.atom-line {
  @include overlay;

  padding: 2.25rem;
}

.ar__border {
  height: 100%;
  border: 2.65rem solid $color-primary;
}
</style>
