import cloneDeep from 'lodash.clonedeep'

export default (module) => (store) => {
  let history = []

  history.push(cloneDeep(store.state[module]))
  let index = 0

  store.subscribe(({ type, payload }, state) => {
    // mutation is of the right module
    if (type.split('/')[0] === module) {
      console.log(type)
      // some redoing/undoing has occured
      if (index < history.length - 1) {
        history.splice(index)
      }

      history.push(cloneDeep(state[module]))
      index++
    }
  })

  store.registerModule('history', {
    namespaced: true,
    getters: {
      // getters have to be functions because otherwise vue will cache them
      canUndo: () => () => index > 0,
      canRedo: () => () => index < history.length - 1,
    },
    actions: {
      undo ({ state, getters, commit }) {
        if (getters.canUndo()) {
          index--
          // this is super hacky, but the reason that object destructuring is used here is because
          // replaceState affects all modules, and this code needs to revert only the module of the history that this plugin controls
          store.replaceState({ ...store.state, [module]: history[index] })
        }
      },
      redo ({ state, getters, commit }) {
        if (getters.canRedo()) {
          index++
          store.replaceState({ ...store.state, [module]: history[index] })
        }
      },
    },
  })
}
