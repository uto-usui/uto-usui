<template>
  <span class="util-split" :aria-label="text">
    <span
      aria-hidden="true"
      class="st__inner"
      v-html="$splitting({ content: text })"
      >{{ text }}</span
    >
  </span>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    text: {
      type: String,
      default: '',
    },
  },

  setup(_props, _ctx) {
    return {
      //
    }
  },
})
</script>

<style lang="scss" scoped>
.util-split {
  display: inline-block;
}
</style>
