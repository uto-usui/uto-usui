<template>
  <div class="atom-rect">
    <div class="ar__border"></div>
  </div>
</template>

<script lang="ts" src="./_Rect.ts"></script>

<style lang="scss" scoped>
.atom-rect {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  padding: 2rem;
  background: linear-gradient(to bottom, #e1e6ec 0%, #f0f4f7 100%),
    linear-gradient(to bottom, #e1e6ec 0%, #f0f4f7 100%);
}

.ar__border {
  height: 100%;
  border: 2.25rem solid $color-primary;
}
</style>
