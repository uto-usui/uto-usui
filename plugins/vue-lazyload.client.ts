import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  preLoad: 1.5,
  attempt: 1,
  observer: true,
  observerOptions: {
    rootMargin: '500px 500px 500px 500px',
    threshold: 0,
  },
})
