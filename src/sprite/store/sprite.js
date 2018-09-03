import { getCanvasFromData, scaleCanvas, scale, transformData } from '../helpers'
import { CANVAS_SIZE, GRID_NUMBER, GRID_SIZE } from '../constants'
import bucketFill from '../bucket-fill'

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

  state: {
    spritesheet: getStoredSpritesheet(),
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
  },

  mutations: {
    setSpritesheet (state, data) {
      state.spritesheet = data
      window.localStorage.setItem('spritesheet', state.spritesheet)
    },
  },

  actions: {
    handleAction ({ state, commit, getters, rootGetters, rootState }, payload) {
      let imageData

      if (payload.type === 'tool' && rootState.sprite.tool === 'bucket') {
        imageData = bucketFill(state.spritesheet, payload.coords, rootState.sprite.color)
      } else {
        imageData = transformData(state.spritesheet, (ctx) => {
          if (payload.type === 'clear') {
            ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
          } else if (payload.type === 'selection') {
            if (rootState.sprite.select.selectTool === 'rectangle-select') {
              ctx.fillRect(...rootGetters['sprite/select/getRectParams'])
            } else if (rootState.sprite.select.selectTool === 'circle-select') {
              ctx.beginPath()
              ctx.ellipse(...rootGetters['sprite/select/getCircleParams'], 0, 0, Math.PI * 2)
              ctx.fill()
            }
          } else if (payload.type === 'tool') {
            const width = rootState.sprite.width
            const params = [
              payload.coords[0] - Math.floor(width / 2),
              payload.coords[1] - Math.floor(width / 2),
              width,
              width,
            ]
            if (rootGetters['sprite/isTool'](['pencil'])) {
              ctx.fillStyle = rootState.sprite.color
              ctx.fillRect(...params)
            } else if (rootGetters['sprite/isTool'](['eraser'])) {
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
  },
}
