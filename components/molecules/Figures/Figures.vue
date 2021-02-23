<template>
  <div class="molecule-figures" :class="[`molecule-figures--${name}`]">
    <div class="mf__inner">
      <div
        v-for="(line, _index) in images"
        :key="`line${_index}`"
        class="mf__line"
        data-scroll
        :data-scroll-target="`#figures-${name}`"
        :data-scroll-speed="_index % 2 ? -1 : 1"
        data-scroll-direction="horizontal"
      >
        <div
          v-for="(figure, __index) in line"
          :key="`figure${_index}${__index}`"
          class="mf__figure-wrap"
        >
          <div class="mf__figure">
            <AtomPicture
              :picture-width="16"
              :picture-height="9"
              :picture-src="require(`Images/test/${figure}`)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./_Figures.ts"></script>

<style lang="scss" scoped>
.molecule-figures {
  --figures-height: 33rem;
  --figure-margin: 0.5rem;
  --figures-inner-width: 200vw;
  --figures-inner-height: var(--figures-height);

  position: relative;
  height: var(--figures-height);
  perspective: 62rem;
}

.mf__inner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--figures-inner-width);
  height: var(--figures-inner-height);
  transform: translate(-50%, -50%);

  .molecule-figures.molecule-figures--woodwork & {
    transform: translate3d(-50%, -50%, 0) translateX(-15%) translateY(-25%)
      translateZ(-200px) rotateX(65.5deg) rotateZ(22deg);
  }

  .molecule-figures.molecule-figures--photograph & {
    transform: translate3d(-50%, -50%, 0) translateX(15%) translateY(-25%)
      translateZ(-200px) rotateX(65.5deg) rotateZ(-22deg);
  }
}

.mf__line {
  display: flex;
}

.mf__figure-wrap {
  flex: none;
  width: calc(var(--figures-inner-width) / 8 - var(--figure-margin) * 2);
  height: calc(
    (var(--figures-inner-width) / 8 - var(--figure-margin) * 2) * 9 / 16
  );
  margin: var(--figure-margin);
  backface-visibility: hidden;
  outline: 1px solid transparent;
}

.mf__figure {
  //
}

.md__value {
  //
}
</style>
