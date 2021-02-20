import * as Global from '../../store/global/type'
import * as Ls from '../../store/ls/type'

declare module 'vuex' {
  type RootState = {
    global: Global.S
    ls: Ls.S
  }
  type RootGetters = Global.RG & Ls.RG
  type RootMutations = Global.RM & Ls.RM
  type RootActions = Global.RA & Ls.RA
}
