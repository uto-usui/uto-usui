import * as Global from '../../store/global/type'
import * as Modal from '../../store/modal/type'
import * as Ls from '../../store/ls/type'

declare module 'vuex' {
  type RootState = {
    global: Global.S
    modal: Modal.S
    ls: Ls.S
  }
  type RootGetters = Global.RG & Modal.RG & Ls.RG
  type RootMutations = Global.RM & Modal.RM & Ls.RM
  type RootActions = Global.RA & Modal.RA & Ls.RA
}
