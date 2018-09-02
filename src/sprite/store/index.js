import { getCanvasFromData, scaleCanvas, scale, transformData } from '../helpers'
import { CANVAS_SIZE, GRID_NUMBER, GRID_SIZE } from '../constants'
import bucketFill from '../bucket_fill'

import selection from './selection'

window.mouseDown = false
window.lastCoords = [null, null]

function getStoredSpritesheet () {
  const spritesheet = window.localStorage.getItem('spritesheet')
  if (spritesheet) {
    try {
      return JSON.parse('[' + window.localStorage.getItem('spritesheet') + ']')
    } catch (e) {}
  }
  return new Array(CANVAS_SIZE ** 2 * 4)
}

export default {
  namespaced: true,

  modules: { selection },

  state: {
    spritesheet: getStoredSpritesheet(),
    tool: 'pencil',
    width: 1,
    color: '#000000',
  },

  getters: {
    sprites: (state) => {
      const canvas = getCanvasFromData(state.spritesheet)
      const ctx = scaleCanvas(canvas)
      let sprites = []
      for (let x = 0; x < GRID_NUMBER; x++) {
        for (let y = 0; y < GRID_NUMBER; y++) {
          sprites.push(ctx.getImageData(...scale(x, y, GRID_SIZE, GRID_SIZE)))
        }
      }
      return sprites
    },

    isTool: (state) => (options) => {
      return options.includes(state.tool)
    },
  },

  mutations: {
    setSpritesheet (state, data) {
      state.spritesheet = data
      window.localStorage.setItem('spritesheet', state.spritesheet)
    },

    // setting the color or tool makes it possible that clicking on the same pixel will produce a different result
    setColor (state, color) {
      state.color = color
      window.lastCoords = [null, null]
    },
    setWidth (state, width) {
      state.width = width
      window.lastCoords = [null, null]
    },
    setTool (state, tool) {
      state.tool = tool
      window.lastCoords = [null, null]
    },
  },

  actions: {
    change ({ state, getters, commit, dispatch }, { eventType, coords }) {
      if (getters.isTool(['pencil', 'eraser', 'bucket'])) {
        let action
        if (getters.selectionExists) {
          if (getters.selectionContains(coords) && getters.isTool(['bucket'])) {
            action = {
              type: 'selection',
            }
          } else {
            commit('resetSelect')
            return
          }
        } else {
          action = {
            type: 'tool',
            coords,
          }
        }
        dispatch('handleAction', action)
      } else if (getters.isTool(['rectangle-select', 'circle-select'])) {
        if (eventType === 'down') {
          commit('startSelect', coords)
        } else {
          commit('resizeSelect', coords)
        }
      }
    },

    handleAction ({ state, commit, getters }, payload) {
      let imageData

      if (payload.type === 'tool' && state.tool === 'bucket') {
        imageData = bucketFill(state.spritesheet, payload.coords, state.color)
      } else {
        let params

        if (payload.type === 'selection') {
          params = getters.accountForNegativeSize
        } else if (payload.type === 'tool') {
          params = [
            payload.coords[0] - Math.floor(state.width / 2),
            payload.coords[1] - Math.floor(state.width / 2),
            state.width,
            state.width,
          ]
        }

        imageData = transformData(state.spritesheet, (ctx) => {
          if (payload.type === 'clear') {
            ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
          } else {
            if (getters.isTool(['pencil', 'bucket'])) {
              ctx.fillStyle = state.color
              ctx.fillRect(...params)
            } else if (getters.isTool(['eraser'])) {
              ctx.clearRect(...params)
            }
          }
        })
      }

      commit('setSpritesheet', imageData)
    },

    clear ({ dispatch }) {
      dispatch('handleAction', { type: 'clear' })
    },

    mouseDown ({ dispatch, commit }, coords) {
      window.mouseDown = true
      if (coords[0] !== window.lastCoords[0] || coords[1] !== window.lastCoords[1]) {
        dispatch('change', { eventType: 'down', coords })
        window.lastCoords = coords
      }
    },
    mouseUp () {
      window.mouseDown = false
    },
    mouseLeave () {
      window.mouseDown = false
    },
    mouseMove ({ state, dispatch }, coords) {
      if (
        window.mouseDown &&
        (coords[0] !== window.lastCoords[0] || coords[1] !== window.lastCoords[1])
      ) {
        dispatch('change', { eventType: 'move', coords })
        window.lastCoords = coords
      }
    },
  },
}
