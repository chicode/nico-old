import {
  handleSpritesheetAction,
  getCtx,
  getCtxParamsForSelection,
  scaleCanvas,
  scale,
} from './helpers'
import { CANVAS_SIZE, GRID_NUMBER, GRID_SIZE, SCALE } from './constants'

export default {
  namespaced: true,

  state: {
    spritesheet: window.localStorage.getItem('spritesheet')
      ? JSON.parse('[' + window.localStorage.getItem('spritesheet') + ']')
      : new Array(CANVAS_SIZE ** 2 * 4),
    tool: 'pencil',
    toolOptions: {
      width: 1,
      color: 'black',
    },
    selectStart: [0, 0],
    selectSize: [0, 0],
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
    selectionContains: (state) => ([x, y]) => {
      let params = getCtxParamsForSelection(state.selectStart, state.selectSize)
      return x >= params[0] && y >= params[1] && x < params[0] + params[2] && params[1] + params[3]
    },
  },

  mutations: {
    changeSpritesheet (state, payload) {
      // generate a new ctx based on the current spritesheet, apply the action to it,
      // and then set it by extracting the imagedata from the updated ctx
      const { ctx } = getCtx(state.spritesheet)
      handleSpritesheetAction(payload, ctx)

      state.spritesheet = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data
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
    setSelectSize (state, size) {
      state.selectSize = size
    },
    setSelectStart (state, coords) {
      state.selectStart = coords
    },
  },

  actions: {
    change ({ state, getters, commit, dispatch }, { eventType, coords }) {
      coords = coords.map((coord) => Math.floor(coord / SCALE))

      if (getters.toolType === 'action') {
        let action
        if (eventType === 'down' && getters.selectionContains(coords)) {
          action = {
            tool: state.tool,
            type: 'selection',
            selectStart: state.selectStart,
            selectSize: state.selectSize,
            color: state.toolOptions.color,
          }
        } else {
          if (eventType === 'down') {
            dispatch('resetSelect')
          }
          action = {
            tool: state.tool,
            type: 'tool',
            coords,
            color: state.toolOptions.color,
            width: state.toolOptions.width,
          }
        }

        commit('changeSpritesheet', action)
      } else {
        if (eventType === 'down') {
          dispatch('startSelect', coords)
        } else {
          commit('setSelectSize', [
            coords[0] - state.selectStart[0],
            coords[1] - state.selectStart[1],
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
    resetSelect ({ commit }) {
      commit('setSelectSize', [0, 0])
    },
    startSelect ({ dispatch, commit }, start) {
      dispatch('resetSelect')
      commit('setSelectStart', start)
    },
  },
}
