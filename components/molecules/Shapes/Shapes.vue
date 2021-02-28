<template>
  <div class="molecules-shapes">
    <svg class="c-icon_list" style="display: none">
      <symbol id="triangle" viewBox="0 0 88.33 76.5">
        <polygon
          class="c-icon_path"
          points="44.17 1 87.47 76 0.87 76 44.17 1"
          style="fill: none; stroke-miterlimit: 10"
        />
      </symbol>
      <symbol id="square" viewBox="0 0 71.71 71.71">
        <rect
          class="c-icon_path"
          x="0.5"
          y="0.5"
          width="70.71"
          height="70.71"
          style="fill: none; stroke-miterlimit: 10"
        />
      </symbol>
      <symbol id="pentagon" viewBox="0 0 96.28 91.57">
        <polygon
          class="c-icon_path"
          points="48.14 0.62 95.69 35.17 77.53 91.07 18.75 91.07 0.59 35.17 48.14 0.62"
          style="fill: none; stroke-miterlimit: 10"
        />
      </symbol>
      <symbol id="mount" viewBox="0 0 64.53 31.26">
        <polyline
          class="c-icon_path"
          points="64.09 30.21 47.25 1.04 32.27 30.21 15.43 1.04 0.45 30.21"
          style="fill: none; stroke-miterlimit: 10"
        />
      </symbol>
      <symbol id="line" viewBox="0 0 53.05 47.39">
        <g class="c-icon_path">
          <path
            d="M.33.37l46,40.56Z"
            style="fill: none; stroke-miterlimit: 10"
          />
          <circle
            cx="48.84"
            cy="43.18"
            r="3.72"
            style="fill: none; stroke-miterlimit: 10"
          />
        </g>
      </symbol>
      <symbol id="hexagon" viewBox="0 0 101.15 87.6">
        <polygon
          class="c-icon_path"
          points="75.58 0.5 100.58 43.8 75.58 87.1 25.58 87.1 0.58 43.8 25.58 0.5 75.58 0.5"
          style="fill: none; stroke-miterlimit: 10"
        />
      </symbol>
      <symbol id="circle" viewBox="0 0 101 101">
        <circle
          class="c-icon_path"
          cx="50.5"
          cy="50.5"
          r="50"
          style="fill: none; stroke-miterlimit: 10"
        />
      </symbol>
    </svg>
    <div class="js-svg-wrap ms__item">
      <div class="ms__inner">
        <svg class="js-svg ms__svg">
          <use xlink:href="#triangle"></use>
        </svg>
      </div>
    </div>
    <div class="js-svg-wrap ms__item">
      <div class="ms__inner">
        <svg class="js-svg ms__svg">
          <use xlink:href="#square"></use>
        </svg>
      </div>
    </div>
    <div class="js-svg-wrap ms__item">
      <div class="ms__inner">
        <svg class="js-svg ms__svg">
          <use xlink:href="#pentagon"></use>
        </svg>
      </div>
    </div>
    <div class="js-svg-wrap ms__item">
      <div class="ms__inner">
        <svg class="js-svg ms__svg">
          <use xlink:href="#mount"></use>
        </svg>
      </div>
    </div>
    <div class="js-svg-wrap ms__item">
      <div class="ms__inner">
        <svg class="js-svg ms__svg">
          <use xlink:href="#line"></use>
        </svg>
      </div>
    </div>
    <div class="js-svg-wrap ms__item">
      <div class="ms__inner">
        <svg class="js-svg ms__svg">
          <use xlink:href="#hexagon"></use>
        </svg>
      </div>
    </div>
    <div class="js-svg-wrap ms__item">
      <div class="ms__inner">
        <svg class="js-svg ms__svg">
          <use xlink:href="#circle"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./_Shapes.ts"></script>

<style lang="scss" scoped>
.molecules-shapes {
  --shape-size: 3.75rem;

  @include desktop {
    --shape-size: 6.25rem;
  }

  @include fullhd {
    --shape-size: 5rem;
  }
}

.ms__item {
  position: absolute;
  top: calc(50% - var(--shape-size) / 2);
  left: calc(50% - var(--shape-size) / 2);
  pointer-events: none;
  opacity: 0;
}

.ms__inner {
  animation: rotate 30s linear infinite;
}

.ms__svg {
  width: var(--shape-size);
  stroke: $color-primary;
}
</style>
