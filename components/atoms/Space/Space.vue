<script lang="ts" src="./_Space.ts"></script>

<style lang="scss" scoped>
$space-sizes: () !default;
$space-sizes: map-deep-merge(
  (
    'x-small': (
      'mobile': calc(10rem * 8 / 14),
      'desktop': calc(10rem * 8 / 14),
    ),
    'small': (
      'mobile': calc(10rem * 8 / 10),
      'desktop': calc(10rem * 8 / 10),
    ),
    'medium': (
      'mobile': calc(10rem * 8 / 8),
      'desktop': calc(10rem * 8 / 8),
    ),
    'large': (
      'mobile': calc(10rem * 8 / 6),
      'desktop': calc(10rem * 8 / 6),
    ),
    'x-large': (
      'mobile': calc(10rem * 8 / 2),
      'desktop': calc(10rem * 8 / 2),
    ),
  ),
  $space-sizes
);

.atom-space {
  height: 20rem;

  @each $name, $sizes in $space-sizes {
    &.atom-space--#{$name} {
      @each $breakpoint, $size in $sizes {
        @include from(map-deep-get($breakpoints, $breakpoint)) {
          height: $size;
        }
      }
    }
  }
}
</style>
