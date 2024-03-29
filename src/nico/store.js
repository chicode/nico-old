import gql from 'graphql-tag'

// inline loader syntax used because otherwise this loader doesn't work
// eslint-disable-next-line
import mars from '!raw-loader!./mars.raw'

import { TEMPLATES, LANGUAGES } from './constants'

function lowerLimit (n) {
  return n < 0 ? 0 : n
}

function convertError (error) {
  const { lineno: lineNumber, colno: columnNumber } = error

  return Object.freeze({
    ...error,
    isSyntax: true,

    from: {
      line: lineNumber - 1,
      ch: lowerLimit(columnNumber - 1),
    },
    to: {
      line: lineNumber - 1,
      ch: lowerLimit(columnNumber),
    },
  })
}

export default {
  namespaced: true,

  state: {
    code: window.localStorage.getItem('code') || '',
    error: null,
    view: window.localStorage.getItem('view') || 'game',
    paused: false,
    running: false,
    mainCtx: null,
    hasBeenRun: false,
    language: null,
    loading: false,
    loadingTime: null,
  },

  getters: {
    pauseDisabled (state) {
      return !state.running
    },

    // combines user code with the mars library to make a runnable program
    // mars goes in front so that a user syntax error does not accidentally
    // propogate to the mars code
    prepareCode: (state) => async (apolloClient) => {
      if (state.language === 'javascript') {
        // this code uses var instead of const because that's the only way to rewrite the value of the variables
        return {
          success: true,
          code: `${state.code};

          var init = init || (() => {})
          var update = update || (() => {})

          ${mars}`,
        }
      } else {
        const {
          data: { compileCode },
        } = await apolloClient.mutate({
          mutation: gql`
            mutation($language: Language!, $code: String!) {
              compileCode(language: $language, code: $code) {
                success
                code
                errors {
                  message
                  from_ {
                    line
                    ch
                  }
                  to {
                    line
                    ch
                  }
                }
                warnings {
                  message
                  from_ {
                    line
                    ch
                  }
                  to {
                    line
                    ch
                  }
                }
              }
            }
          `,
          variables: {
            language: state.language.toUpperCase(),
            code: state.code,
          },
        })

        if (compileCode.success) {
          // the var is required because `require` is defined without a declaration
          return {
            success: true,
            code: `
            var ${compileCode.code};
            const module = require('4')

            const init = module.init || (() => {})
            const update = module.update || (() => {})
            const draw = module.draw

            ${mars}`,
          }
        } else {
          return {
            success: false,
            // rename from_ to from
            errors: compileCode.errors.map((error) => ({
              ...error,
              from: error.from_,
              from_: undefined,
              isSyntax: true,
            })),
          }
        }
      }
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
    setLanguage (state, language) {
      state.language = language
    },
    loadBoilerplate (state) {
      state.code = TEMPLATES[LANGUAGES[state.language]]
    },
    setError (state, error) {
      state.error = error
    },
    setLoading (state, loading) {
      state.loading = loading
    },
    setLoadingTime (state, loadingTime) {
      state.loadingTime = loadingTime
    },
    initMainCtx (state, ctx) {
      state.mainCtx = ctx
    },
  },

  actions: {
    run ({ state, commit, rootGetters, rootState, getters }) {
      commit('setView', 'game')
      commit('setRunning', false)
      commit('setError', null)
      commit('setLoading', false)

      window.onerror = (message, source, lineno, colno, error) => {
        commit('setError', convertError({ message, source, lineno, colno, error }))
        commit('setRunning', false)
      }

      setTimeout(() => {
        if (state.language !== 'javascript') {
          commit('setLoading', true)
          this.apolloClient
            .query({
              query: gql`
                query compilationTime($language: Language!) {
                  compilationTime(language: $language)
                }
              `,
              variables: {
                language: state.language.toUpperCase(),
              },
              fetchPolicy: 'network-only',
            })
            .then(({ data: { compilationTime } }) => {
              console.log('set', compilationTime)
              commit('setLoadingTime', compilationTime)
            })
        }
        getters.prepareCode(this.apolloClient).then(({ success, code, errors }) => {
          commit('setLoading', false)

          if (success) {
            commit('setRunning', true)
            commit('setPaused', false)

            const _ctx = state.mainCtx // eslint-disable-line no-unused-vars
            const _state = state // eslint-disable-line no-unused-vars
            const _sprites = rootGetters['sprite/sprite/sprites'] // eslint-disable-line no-unused-vars

            // eslint-disable-next-line
            // this timeout makes the error throw on the window level
            // 'escaping' this promise
            // eslint-disable-next-line no-eval
            setTimeout(() => eval(code))
          } else {
            commit('setError', errors[0])
          }
        })
      })
    },
  },
}
