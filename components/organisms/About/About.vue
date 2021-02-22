<template>
  <section class="organism-about">
    <div class="oa__title">
      <AtomTitle text="_About" />
    </div>

    <section class="oa__item">
      <div class="oa__name"><AtomHed :text="`skill set`" /></div>

      <dl
        v-for="(item, index) in data.skill"
        :key="`MoleculeDesc${index}`"
        class="oa__desc"
      >
        <dt class="oa__desc-name" v-text="item.name" />
        <dd class="oa__desc-value" v-text="item.tags" />
      </dl>
    </section>

    <section class="oa__item">
      <div class="oa__name"><AtomHed :text="`social`" /></div>

      <ul class="oa__social">
        <li
          v-for="(_item, _index) in data.social"
          :key="`oa__social${_index}`"
          class="aa__social-item"
        >
          <a :href="_item.link" target="_blank" v-html="_item.name" />
        </li>
      </ul>
    </section>

    <section class="oa__item">
      <div class="oa__name"><AtomHed :text="`fav`" /></div>

      <div class="oa__paragraph"><AtomParagraph :text="data.fav" /></div>
    </section>
  </section>
</template>

<script lang="ts" src="./_About.ts"></script>

<style lang="scss" scoped>
.organism-about {
  //
}

.oa__title {
  margin-bottom: get-line-height(-2, 3, 8);
}

.oa__item {
  @include touch {
    padding-right: 2.5rem;
    padding-left: 2.5rem;
  }

  max-width: 42.5rem;
  margin: auto;
  text-align: left;

  + .oa__item {
    margin-top: get-line-height(-2, 3, 2);
  }
}

.oa__name {
  margin-bottom: get-line-height(-2, 3, 1);
}

.oa__desc {
  display: flex;

  @include sizes(-2, 3);
}

.oa__desc-name {
  flex-shrink: 0;
  width: 5rem;
  font-weight: 700;
}

.oa__desc-value {
  //
}

.oa__social {
  display: flex;
  justify-content: space-between;

  @include sizes(-2, 3);
}

.aa__social-item {
  //
}
</style>
