export interface GtagClickEvent {
  (link: string, category: string): void
}

export default (context, inject) => {
  context.$gtagClickEvent = (link: string, category: string) =>
    context.$gtag('event', 'click', {
      event_category: category,
      event_label: link,
    })
  inject('gtagClickEvent', (link: string, category: string) =>
    context.$gtag('event', 'click', {
      event_category: category,
      event_label: link,
    }),
  )
}
