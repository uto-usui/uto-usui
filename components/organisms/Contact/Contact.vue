<template>
  <section class="organism-contact">
    <div class="ac__texts">
      <p
        class="oc__email"
        data-scroll
        data-scroll-speed="1"
        data-scroll-direction="horizontal"
      >
        <a class="oc__target" href="mailto:me@uto-usui.com" target="_blank">
          me@uto-usui.com me@uto-usui.com me@uto-usui.com
        </a>
      </p>
      <p
        class="oc__crazy"
        data-scroll
        data-scroll-speed="-1"
        data-scroll-direction="horizontal"
      >
        🐈 crazy days / crazy feeling 🐈 crazy days / crazy feeling 🐈 crazy
        days / crazy feeling 🐈 crazy days / crazy feeling 🐈 crazy days / crazy
        feeling 🐈 crazy days / crazy feeling 🐈 crazy days / crazy feeling 🐈
        crazy days / crazy feeling 🐈
      </p>
    </div>

    <div class="oo__title">
      <AtomTitle text="_Get In Touch" />
    </div>
  </section>
</template>

<script lang="ts" src="./_Contact.ts"></script>

<style lang="scss" scoped>
.organism-contact {
  position: relative;
  min-height: 100vh;
}

.ac__texts {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  white-space: nowrap;
  transform: translateX(-5%) translateY(-50%);
}

.oc__email {
  font-style: italic;
  opacity: 0.7;

  @include sizes(7);
}

.oc__target {
  //
}

.oc__crazy {
  font-style: italic;
  opacity: 0.7;

  @include sizes(1);
}

.oo__title {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
