<template>
  <section class="organism-overview">
    <div class="oo__inner">
      <div class="oo__main">
        <ClientOnly>
          <div class="oo__lead">
            <AtomLead split :text="data.title" />
          </div>

          <div class="oo__paragraph">
            <AtomParagraph
              v-for="(item, index) in data.text"
              :key="`p${index}`"
              split
              :text="item"
            />
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
      </div>

      <div class="oo__ghost" aria-hidden="true">
        <div class="oo__lead">
          <AtomLead :text="data.title" />
        </div>

        <div class="oo__paragraph">
          <AtomParagraph
            v-for="(item, index) in data.text"
            :key="`p${index}`"
            :text="item"
          />
        </div>
        <div class="oo__paragraph">
          <AtomParagraph
            v-for="(item, index) in links"
            :key="`mo_paragraph${index}`"
            :text="item"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" src="./_Overview.ts"></script>

<style lang="scss" scoped>
.organism-overview {
  max-width: 42.5rem;
  padding-top: 8.5rem;
  margin: auto;

  @include touch {
    padding-right: 2.5rem;
    padding-left: 2.5rem;
  }

  @include desktop {
    padding-top: 17vw;
  }
}

.oo__inner {
  position: relative;
}

.oo__ghost {
  visibility: hidden;
}

.oo__main {
  position: absolute;
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
