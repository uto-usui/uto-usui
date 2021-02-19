/* eslint camelcase: 0 */

export interface Gtag {
  (
    command: 'config',
    targetId: string,
    config?: ControlParams | EventParams | CustomParams,
  ): void

  (command: 'set', config: CustomParams): void

  (
    command: 'event',
    eventName: EventNames | string,
    eventParams?: ControlParams | EventParams | CustomParams,
  ): void
}

export interface CustomParams {
  [key: string]: any
}

export interface ControlParams {
  groups?: string | string[]
  send_to?: string | string[]
  event_callback?: () => void
  event_timeout?: number
}

export type EventNames =
  | 'add_payment_info'
  | 'add_to_cart'
  | 'add_to_wishlist'
  | 'begin_checkout'
  | 'checkout_progress'
  | 'exception'
  | 'generate_lead'
  | 'login'
  | 'page_view'
  | 'purchase'
  | 'refund'
  | 'remove_from_cart'
  | 'screen_view'
  | 'search'
  | 'select_content'
  | 'set_checkout_option'
  | 'share'
  | 'sign_up'
  | 'timing_complete'
  | 'view_item'
  | 'view_item_list'
  | 'view_promotion'
  | 'view_search_results'

export interface EventParams {
  checkout_option?: string
  checkout_step?: number
  content_id?: string
  content_type?: string
  coupon?: string
  currency?: string
  description?: string
  fatal?: boolean
  items?: Item[]
  method?: string
  number?: string
  promotions?: Promotion[]
  screen_name?: string
  search_term?: string
  shipping?: Currency
  tax?: Currency
  transaction_id?: string
  value?: number
  event_label?: string
  event_category: string
}

export type Currency = string | number

export interface Item {
  brand?: string
  category?: string
  creative_name?: string
  creative_slot?: string
  id?: string
  location_id?: string
  name?: string
  price?: Currency
  quantity?: number
}

export interface Promotion {
  creative_name?: string
  creative_slot?: string
  id?: string
  name?: string
}
