<template>
  <h2 class="atom-hed" v-text="text" />
</template>

<script lang="ts" src="./_Hed.ts"></script>

<style lang="scss" scoped>
.atom-hed {
  font-weight: 700;

  @include sizes(6);
}
</style>
