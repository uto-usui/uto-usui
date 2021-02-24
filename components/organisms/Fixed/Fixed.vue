<template>
  <div class="organism-fixed">
    <div class="of__name"><AtomName :text="'uto usui'" /></div>
    <div class="of__rect"><AtomRect /></div>
    <div class="of__sound"><AtomSound /></div>
    <div class="of__nav"><MoleculeNav /></div>
    <div class="of__shapes"><MoleculeShapes /></div>
    <div class="of__loader"><AtomLoader /></div>
  </div>
</template>

<script lang="ts" src="./_Fixed.ts"></script>

<style lang="scss" scoped>
.organism-fixed {
  //
}

.of__name {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
}

.of__rect {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -2;
  pointer-events: none;
}

.of__sound {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  z-index: 9;
}

.of__nav {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 9;

  @include desktop {
    top: 0;
    right: 6rem;
    left: auto;
  }
}

.of__shapes {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  pointer-events: none;
}

.of__loader {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9;
  pointer-events: none;
}
</style>
