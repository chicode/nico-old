import Vue from 'vue'
import Vuex from 'vuex'
import mars from './mars.raw'

Vue.use(Vuex)

// combines user code with the mars library to make a runnable program
function prepareCode (code) {
  return `
  ${code}
  ${mars}
  `
}

export const GRID_SIZE = 8
export const GRID_NUMBER = 10
export const CANVAS_SIZE = GRID_SIZE * GRID_NUMBER
export const SCALE = 10
export const COLORS = {
  night: '#000000',
  crown: '#572956',
  rose: '#B14156',
  sunset: '#EE7B58',
  lemon: '#FFD079',
  grass: '#A0F072',
  bush: '#38B86E',
  swamp: '#276E7B',
  ocean: '#29366F',
  berry: '#405BD0',
  pool: '#4FA4F7',
  sky: '#86ECF8',
  cloud: '#F4F4F4',
  cement: '#93B6C1',
  metal: '#557185',
  coal: '#324056',
}

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

// create a ctx based on some imagedata
// uses a global ctx variable to prevent making a new canvas on every call
export function getCtx (data) {
  let imageData = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE)
  imageData.data.set(data)
  ctx.putImageData(imageData, 0, 0)
  return { canvas, ctx }
}

export function handleSpritesheetAction (action, ctx) {
  switch (action.tool) {
    case 'pencil': {
      ctx.fillStyle = action.color
      ctx.fillRect(
        action.x - Math.floor(action.width / 2),
        action.y - Math.floor(action.width / 2),
        action.width,
        action.width,
      )
      break
    }

    case 'eraser': {
      ctx.clearRect(
        action.x - Math.floor(action.width / 2),
        action.y - Math.floor(action.width / 2),
        action.width,
        action.width,
      )
      break
    }
  }
}

// window variables so that code in an eval statement can access them
window.paused = false
window.running = false

export default new Vuex.Store({
  state: {
    code: '',
    compiledCode: '',
    error: '',
    view: 'sprite',
    spritesheet: new Array(CANVAS_SIZE ** 2 * 4),
    paused: false,
    running: false,
  },
  mutations: {
    changeView (state, { view }) {
      state.view = view
      if (state.running) {
        state.paused = true
        window.paused = true
      }
    },
    changeSpritesheet (state, payload) {
      // generate a new ctx based on the current spritesheet, apply the action to it,
      // and then set it by extracting the imagedata from the updated ctx
      const { ctx } = getCtx(state.spritesheet)
      handleSpritesheetAction(payload, ctx)

      state.spritesheet = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data
    },
    run (state) {
      state.view = 'game'
      state.compiledCode = prepareCode(state.code)

      state.running = false
      window.running = false
      state.paused = false
      window.paused = false

      // TODO: lint code and set error state variable

      // this hacky timeout serves two purposes:
      // 1) to make sure that vue registers the change to the running
      // state variable, even if it's going from true -> true
      // 2) to give the currently running game one frame to not trigger the
      // requestAnimationFrame, thereby terminating it
      setTimeout(() => {
        state.running = true
        window.running = true
      })
    },
    togglePause (state) {
      state.paused = !state.paused
      window.paused = !window.paused
    },
  },
})
