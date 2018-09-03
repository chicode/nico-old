import Vue from 'vue'
import Vuex from 'vuex'

import nico from './nico/store'
import sprite from './sprite/store'

import historyPlugin from './history-plugin'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    nico,
    sprite,
  },
  plugins: [
    historyPlugin('sprite', [], (store) => {
      // hacky fix to save spritesheet without mutation
      window.localStorage.setItem('spritesheet', store.state.sprite.spritesheet)
      window.lastCoords = [null, null]
    }),
  ],
})
