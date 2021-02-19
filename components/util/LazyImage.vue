<template>
  <img
    v-lazy="src"
    :alt="alt"
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
  />
</template>

<script lang="ts">
export default {
  props: {
    src: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped lang="scss">
[lazy='loading'] {
  opacity: 0;
}

[lazy='error'] {
  //
}

[lazy='loaded'] {
  opacity: 1;
  transition: opacity 0.3s $easeOutSine;
}
</style>
