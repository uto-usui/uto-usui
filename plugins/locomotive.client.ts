import locomotiveScroll from 'locomotive-scroll'
import 'locomotive-scroll/dist/locomotive-scroll.min.css'

export default (context, inject) => {
  context.$locomotiveScroll = locomotiveScroll
  inject('locomotiveScroll', locomotiveScroll)
}
