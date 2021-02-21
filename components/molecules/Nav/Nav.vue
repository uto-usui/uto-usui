<template>
  <nav class="molecules-nav">
    <ul class="mn__list">
      <li
        v-for="(item, index) in list"
        :key="`mn__item${index}}`"
        class="mn__item"
      >
        <a class="mn__target" v-text="item" />
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" src="./_Nav.ts"></script>

<style lang="scss" scoped>
.molecules-nav {
  //
}

.mn__list {
  display: flex;
  justify-content: center;
}

.mn__item {
  //
}

.mn__target {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 9rem;
  padding-right: 0.75rem;
  padding-left: 0.75rem;
  color: $color-gray-level1;
  letter-spacing: 0.1em;

  @include sizes(-1);

  @include desktop {
    padding-right: 1.5rem;
    padding-left: 1.5rem;
  }

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    content: '';
    background-color: rgba($color-primary, 0.9);
    transition: transform 0.4s $easeInCubic;
    transform: scaleX(0);
    transform-origin: right center;
  }
  //
  &::before {
    position: absolute;
    top: calc(50% + 1.5rem);
    left: calc(50% - 1px);
    width: 1px;
    height: 0.5rem;
    content: '';
    background-color: currentColor;
  }
  //
  &:hover {
    color: $color-white;
    //
    &::after {
      transition: transform 0.4s $easeOutCubic;
      transform: scaleX(1);
      transform-origin: left center;
    }
  }
}
</style>
