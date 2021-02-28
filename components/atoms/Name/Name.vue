<template>
  <h1 id="atom-name" class="atom-name">
    <span v-for="(item, index) in text" :key="index">
      <span class="js-name" v-text="item" />
    </span>
  </h1>
</template>

<script lang="ts" src="./_Name.ts"></script>

<style lang="scss" scoped>
.atom-name {
  font-size: 20vw;
  letter-spacing: -0.05em;
  opacity: 0.08;

  > span {
    display: inline-block;
    min-width: 0.25em;
    padding-right: 0.1em;
    margin-right: -0.1em;
    overflow: hidden;

    > span {
      display: inline-block;
      transform: translateX(150%);
    }
  }
}
</style>
