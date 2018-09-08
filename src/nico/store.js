// inline loader syntax used because otherwise this loader doesn't work
// eslint-disable-next-line
import mars from '!raw-loader!./mars.raw'

import { TEMPLATE } from './constants'

// combines user code with the mars library to make a runnable program
function prepareCode (code) {
  return `${code}
  ${mars}`
}

function convertError (error) {
  const { lineno: lineNumber, colno: columnNumber } = error
  return Object.freeze({
    ...error,

    from: {
      line: lineNumber - 1,
      ch: columnNumber - 1,
    },
    to: {
      line: lineNumber - 1,
      ch: columnNumber,
    },
  })
}

export default {
  namespaced: true,

  state: {
    code: window.localStorage.getItem('code') || TEMPLATE,
    error: null,
    view: window.localStorage.getItem('view') || 'sprite',
    paused: false,
    running: false,
    mainCtx: null,
    hasBeenRun: false,
  },

  getters: {
    pauseDisabled (state) {
      return !state.running
    },
  },

  mutations: {
    setView (state, view) {
      state.view = view
      if (state.running) {
        state.paused = true
      }
      window.localStorage.setItem('view', state.view)
    },
    togglePause (state) {
      state.paused = !state.paused
      if (!state.paused) {
        state.view = 'game'
      }
    },
    setCode (state, code) {
      state.code = code
      window.localStorage.setItem('code', state.code)
    },
    setRunning (state, running) {
      state.running = running
      state.hasBeenRun = true
    },
    setPaused (state, pause) {
      state.paused = pause
    },
    setError (state, error) {
      state.error = error ? convertError(error) : null
    },
    initMainCtx (state, ctx) {
      state.mainCtx = ctx
    },
  },

  actions: {
    run ({ state, commit, rootGetters, rootState }) {
      commit('setView', 'game')
      commit('setRunning', false)
      commit('setError', null)

      // TODO: lint code and set error state variable

      // this hacky timeout serves two purposes:
      // 1) to make sure that vue registers the change to the running
      // state variable, even if it's going from true -> true
      // 2) to give the currently running game one frame to not trigger the
      // requestAnimationFrame, thereby terminating it
      setTimeout(() => {
        commit('setRunning', true)
        commit('setPaused', false)

        // eslint-disable-next-line no-unused-vars
        const _env = {
          ctx: state.mainCtx,
          sprites: rootGetters['sprite/sprite/sprites'],
          state,
        }

        const code = prepareCode(state.code)

        window.onerror = (message, source, lineno, colno, error) => {
          commit('setError', { message, source, lineno, colno, error })
          commit('setRunning', false)
        }

        // eslint-disable-next-line
        eval(code)

        // error handling done in window event listener because that's the only way to
        // get an error from an eval statement
        // https://stackoverflow.com/a/26929319
      })
    },
  },
}
