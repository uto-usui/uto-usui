<template>
  <dl class="molecule-desc">
    <dt class="md__name" v-text="name" />
    <dd class="md__value" v-text="value" />
  </dl>
</template>

<script lang="ts" src="./_Desc.ts"></script>

<style lang="scss" scoped>
.molecule-desc {
  display: flex;
  align-items: center;
}

.md__name {
  //
}

.md__value {
  //
}
</style>
