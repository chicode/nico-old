import mars from './mars.raw'

// combines user code with the mars library to make a runnable program
function prepareCode (code) {
  return `
  ${code}
  ${mars}
  `
}

export default {
  namespaced: true,

  state: {
    code: window.localStorage.getItem('code') || '',
    compiledCode: '',
    error: '',
    view: 'sprite',
    paused: false,
    running: false,
    sprites: [],
    mainCtx: null,
  },

  getters: {
    pauseDisabled (state) {
      return !state.running
    },
  },

  mutations: {
    changeView (state, view) {
      state.view = view
      if (state.running) {
        state.paused = true
      }
    },
    togglePause (state) {
      state.paused = !state.paused
      if (!state.paused) {
        state.view = 'game'
      }
    },
    changeCode (state, code) {
      state.code = code
      window.localStorage.setItem('code', state.code)
    },
    setRunning (state, running) {
      state.running = running
    },
    setPaused (state, pause) {
      state.paused = pause
    },
    setError (state, error) {
      state.error = error
    },
    initMainCtx (state, ctx) {
      state.mainCtx = ctx
    },
  },

  actions: {
    run ({ state, commit, rootGetters, rootState }) {
      commit('changeView', 'game')
      commit('setRunning', false)

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
          sprites: rootGetters['sprite/sprites'],
          state,
        }

        try {
          // eslint-disable-next-line
          eval(prepareCode(state.code))
        } catch (e) {
          commit('setError', e.message)
        }
      })
    },
  },
}