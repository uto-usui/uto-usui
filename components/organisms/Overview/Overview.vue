<template>
  <section class="organism-overview">
    <ClientOnly>
      <div class="oo__lead">
        <AtomLead split :text="data.title" />
      </div>

      <div class="oo__paragraph">
        <AtomParagraph split :text="data.text" />
      </div>
      <div class="oo__paragraph">
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
.organism-overview {
  @include touch {
    padding-right: 2.5rem;
    padding-left: 2.5rem;
  }

  max-width: 42.5rem;
  margin: auto;
}

.oo__lead {
  margin-bottom: get-line-height(-2, 3, 1);
}

.oo__paragraph {
  + .oo__paragraph {
    margin-top: get-line-height(-2, 3, 1);
  }
}
</style>
