<script lang="ts" src="./_Picture.ts"></script>

<style lang="scss" scoped>
.the-picture {
  position: relative;
  width: 100%;
  height: 0;
  overflow: hidden;

  &::after {
    pointer-events: none;
    content: '';

    @include overlay;

    background-image: linear-gradient(45deg, white, rgba(black, 0));
    mix-blend-mode: lighten;
    opacity: 0;
  }
}

.tp__img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
}
</style>
