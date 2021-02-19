import Splitting from 'splitting'
import 'splitting/dist/splitting.css'
import 'splitting/dist/splitting-cells.css'

export default (context, inject) => {
  context.$splitting = (options) => Splitting.html(options)
  inject('splitting', (options) => Splitting.html(options))
}
