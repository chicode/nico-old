import Vue from 'vue'
import Vuex from 'vuex'

import nico from './nico/store'
import sprite from './sprite/store'

import historyPlugin from './history_plugin'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    nico,
    sprite,
  },
  plugins: [historyPlugin('sprite')],
})
