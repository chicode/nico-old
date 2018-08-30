import { getCtx, scaleCanvas, scale, getImageData } from '../helpers'
import { CANVAS_SIZE, GRID_NUMBER, GRID_SIZE } from '../constants'

import selection from './selection'

export default {
  namespaced: true,

  modules: { selection },

  state: {
    spritesheet: window.localStorage.getItem('spritesheet')
      ? JSON.parse('[' + window.localStorage.getItem('spritesheet') + ']')
      : new Array(CANVAS_SIZE ** 2 * 4),
    tool: 'pencil',
    toolOptions: {
      width: 1,
      color: 'black',
    },
    mouseDown: false,
  },

  getters: {
    sprites: (state) => {
      const { canvas } = getCtx(state.spritesheet)
      const ctx = scaleCanvas(canvas)
      let sprites = []
      for (let x = 0; x < GRID_NUMBER; x++) {
        for (let y = 0; y < GRID_NUMBER; y++) {
          sprites.push(ctx.getImageData(...scale(x, y, GRID_SIZE, GRID_SIZE)))
        }
      }
      return sprites
    },
    toolType: (state) => {
      return ['pencil', 'eraser'].includes(state.tool) ? 'action' : 'select'
    },
  },

  mutations: {
    changeSpritesheet (state, data) {
      state.spritesheet = data
      window.localStorage.setItem('spritesheet', state.spritesheet)
    },

    selectColor (state, color) {
      state.toolOptions.color = color
    },
    switchTool (state, tool) {
      state.tool = tool
    },

    changeMouse (state, down) {
      state.mouseDown = down
    },
  },

  actions: {
    change ({ state, getters, commit, dispatch }, { eventType, coords }) {
      if (getters.toolType === 'action') {
        let action
        if (eventType === 'down' && getters.selectionContains(coords)) {
          action = {
            type: 'selection',
          }
        } else {
          if (eventType === 'down') {
            commit('resetSelect')
          }
          action = {
            type: 'tool',
            coords,
          }
        }
        dispatch('handleAction', action)
      } else {
        if (eventType === 'down') {
          commit('startSelect', coords)
        } else {
          commit('setSelectSize', [
            coords[0] - state.selection.selectStart[0],
            coords[1] - state.selection.selectStart[1],
          ])
        }
      }
    },
    mouseDown ({ dispatch, commit }, coords) {
      commit('changeMouse', true)
      dispatch('change', { eventType: 'down', coords })
    },
    mouseUp ({ commit }) {
      commit('changeMouse', false)
    },
    mouseMove ({ state, dispatch }, coords) {
      if (state.mouseDown) dispatch('change', { eventType: 'move', coords })
    },

    handleAction ({ state, commit, getters }, payload) {
      let params
      if (payload.type === 'selection') {
        params = getters.accountForNegativeSize
      } else {
        params = [
          payload.coords[0] - Math.floor(state.toolOptions.width / 2),
          payload.coords[1] - Math.floor(state.toolOptions.width / 2),
          state.toolOptions.width,
          state.toolOptions.width,
        ]
      }

      const { ctx } = getCtx(state.spritesheet)

      if (state.tool === 'pencil') {
        ctx.fillStyle = state.toolOptions.color
        ctx.fillRect(...params)
      } else if (state.tool === 'eraser') {
        ctx.clearRect(...params)
      }

      commit('changeSpritesheet', getImageData(ctx))
    },
  },
}
