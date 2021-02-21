<template>
  <section class="molecules-overview">
    <ClientOnly>
      <div class="mo__lead">
        <AtomLead split :text="data.title" />
      </div>

      <div class="mo__paragraph">
        <AtomParagraph split :text="data.text" />
      </div>
      <div class="mo__paragraph">
        <AtomParagraph
          v-for="(item, index) in links"
          :key="`mo_paragraph${index}`"
          split
          :text="item"
        />
      </div>
    </ClientOnly>
  </section>
</template>

<script lang="ts" src="./_Overview.ts"></script>

<style lang="scss" scoped>
.molecules-overview {
  @include touch {
    padding-right: 2.5rem;
    padding-left: 2.5rem;
  }

  max-width: 42.5rem;
  margin: auto;
}

.mo__lead {
  margin-bottom: get-line-height(-2, 3, 1);
}

.mo__paragraph {
  + .mo__paragraph {
    margin-top: get-line-height(-2, 3, 1);
  }
}
</style>
