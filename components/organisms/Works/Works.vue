<template>
  <section class="organism-works">
    <div class="ow__title" data-scroll data-scroll-speed="-1.5">
      <AtomTitle text="_Works" />
    </div>

    <AtomSpace />

    <section
      v-for="(item, index) in list"
      :id="`ow_figures${index}`"
      :key="`ow__item${index}`"
      class="ow__item"
    >
      <div class="ow__texts" data-scroll data-scroll-speed="-1">
        <div class="ow__name">
          <AtomHed :text="item.name" />
        </div>

        <div class="ow__paragraph"><AtomParagraph :text="item.text" /></div>

        <div class="ow__tags"><AtomTag :text="item.tag" /></div>

        <div class="ow__paragraph">
          <AtomParagraph
            :text="`<a href='${item.link}' data-color='${item.color}' target='_blank'>Visit To Website_</a>`"
          />
        </div>
      </div>
      <div class="ow__figures" data-scroll data-scroll-speed="1">
        <div class="ow__figures-inner">
          <div
            v-for="(_item, _index) in item.images"
            :key="`aw__figure${_index}`"
            class="ow__figure"
            data-scroll
            :data-scrol-target="`#ow_figures${index}`"
            :data-scroll-speed="_index % 2 ? -1 : 1"
            data-scroll-direction="horizontal"
          >
            <div class="ow__figure-inner">
              <AtomPicture
                :picture-width="16"
                :picture-height="9"
                :picture-src="require(`Images/${_item}`)"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script lang="ts" src="./_Works.ts"></script>

<style lang="scss" scoped>
.organism-works {
  padding-right: 2.5rem;
  padding-left: 2.5rem;

  @include desktop {
    padding-right: 4.9rem;
    padding-left: 4.9rem;
  }
}

.ow__title {
  margin-right: -4.9rem;
}

.ow__item {
  @include desktop {
    display: flex;
  }

  + .ow__item {
    @include touch {
      margin-top: get-line-height(-2, 3, 2);
    }
  }
}

.ow__texts {
  text-align: left;

  @include desktop {
    width: 62.5%;
    padding-left: 2.5rem;
  }
}

.ow__figures {
  @include touch {
    margin-top: get-line-height(-2, 3, 1);
    margin-right: -2.5rem;
    margin-left: -2.5rem;
  }

  @include desktop {
    width: 37.5%;
  }
}

.ow__figures-inner {
  @include desktop {
    transform: perspective(600px) translateY(-40%) rotateX(45deg) rotateZ(40deg)
      translate3d(-2rem, 0, -18rem);
  }
}

.ow__figure {
  overflow: hidden;
  backface-visibility: hidden;
  outline: 1px solid transparent;

  + .ow__figure {
    margin-top: 1rem;
  }
}

.ow__figure-inner {
  //
}

.ow__name {
  margin-bottom: get-line-height(-2, 3, 1);

  @include desktop {
    margin-bottom: get-line-height(-2, 3, 2);
  }
}

.ow__paragraph {
  //
}

.ow__tags {
  margin-top: get-line-height(-2, 3, 1);
  margin-bottom: get-line-height(-2, 3, 1);

  @include desktop {
    margin-bottom: get-line-height(-2, 3, 3);
  }
}
</style>
