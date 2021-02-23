<template>
  <section class="organism-other">
    <div class="oo__title">
      <AtomTitle text="_Other" />
    </div>

    <AtomSpace />

    <section
      v-for="(item, index) in list"
      :id="`figures-${item.name}`"
      :key="`oo__item${index}`"
      class="oo__item"
    >
      <div class="oo__name"><AtomHed :text="item.name" /></div>

      <template v-if="item.name === 'woodwork' || item.name === 'photograph'">
        <MoleculeFigures :images="item.images" :name="item.name" />
        <AtomSpace :x-small="item.name === 'woodwork'" />
      </template>

      <div v-if="item.name === 'music'" class="oo__figures">
        <AtomSpace />
        <div class="oo__figures-inner">
          <div class="oo__figure oo__figure--left">
            <div
              data-scroll
              data-scroll-speed="-0.5"
              data-scroll-direction="horizontal"
            >
              <AtomPicture
                :picture-width="16"
                :picture-height="9"
                :picture-src="require(`Images/test/${item.image}`)"
              />
            </div>
          </div>
          <div class="oo__figure oo__figure--right">
            <div
              data-scroll
              data-scroll-speed="0.5"
              data-scroll-direction="horizontal"
            >
              <div class="oo__figure-inner">
                <no-ssr>
                  <youtube ref="youtube" :video-id="item.youtube" />
                </no-ssr>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script lang="ts" src="./_Other.ts"></script>

<style lang="scss" scoped>
.organism-works {
  //
}

.oo__texts {
  text-align: left;
}

.oo__figures {
  //
}

.oo__figures-inner {
  display: flex;
}

.oo__figure {
  width: 50%;

  &.oo__figure--right {
    transform: scale(1.1) translateX(-5%) rotateX(5deg) rotateY(45deg)
      rotateZ(5deg) translateY(-25%);
  }

  &.oo__figure--left {
    transform: scale(1.1) translateX(5%) rotateX(5deg) rotateY(-45deg)
      rotateZ(-5deg) translateY(-25%);
  }
}

.oo__figure-inner {
  position: relative;
  max-width: 100%;
  height: 0;
  padding-bottom: 56.25%;
  overflow: hidden;
  //
  &::v-deep iframe,
  &::v-deep object,
  &::v-deep embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.oo__name {
  padding-left: 2.5rem;
  margin-bottom: get-line-height(-2, 3, 2);
  text-align: left;

  @include desktop {
    padding-left: calc(4.9rem + 2.5rem);
  }
}

.oo__paragraph {
  //
}
</style>
