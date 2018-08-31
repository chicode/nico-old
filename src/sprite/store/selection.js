export default {
  state: {
    selectStart: [0, 0],
    selectSize: [0, 0],
  },

  getters: {
    accountForNegativeSize: (state) => [
      state.selectStart[0] + (state.selectSize[0] < 0 ? state.selectSize[0] : 0),
      state.selectStart[1] + (state.selectSize[1] < 0 ? state.selectSize[1] : 0),
      Math.abs(state.selectSize[0]),
      Math.abs(state.selectSize[1]),
    ],
    selectionContains: (state, getters) => ([x, y]) => {
      let params = getters.accountForNegativeSize
      return x >= params[0] && y >= params[1] && x < params[0] + params[2] && params[1] + params[3]
    },
  },

  mutations: {
    resizeSelect (state, coords) {
      state.selectSize = [coords[0] - state.selectStart[0], coords[1] - state.selectStart[1]]
    },
    resetSelect (state) {
      state.selectSize = [0, 0]
    },
    startSelect (state, start) {
      state.selectSize = [0, 0]
      state.selectStart = start
    },
  },
}
