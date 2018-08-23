<template>
  <div>
    <canvas ref="mainCanvas" />
    <p v-if="error">
      {{ error }}
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { SCALE, getCtx, CANVAS_SIZE, GRID_SIZE, GRID_NUMBER } from '@/store'

export default {
  name: 'Game',

  data () {
    return {
      error: '',
    }
  },

  computed: {
    ...mapState(['view']),
    mainCtx () {
      return this.$refs.mainCanvas.getContext('2d')
    },
  },

  watch: {
    view (newView, oldView) {
      // switched away from game
      if (oldView === 'game' && newView !== 'game') {
        window.stopped = true
      // switch to game
      } else if (oldView !== 'game' && newView === 'game') {
        this.init()
      }
    },
  },

  methods: {
    init () {
      /* eslint-disable no-unused-vars */
      const ctx = this.mainCtx
      const { canvas } = getCtx(this.$store.state.spritesheet)
      const spriteCtx = document.createElement('canvas').getContext('2d')
      spriteCtx.imageSmoothingEnabled = false
      spriteCtx.scale(SCALE, SCALE)
      spriteCtx.drawImage(canvas, 0, 0)

      let GRID_NUMBER_ = GRID_NUMBER
      let GRID_SIZE_ = GRID_SIZE
      let CANVAS_SIZE_ = CANVAS_SIZE
      let SCALE_ = SCALE

      window.stop = false
      try {
        // eslint-disable-next-line
        eval(this.$store.state.compiledCode)
      } catch (e) {
        this.error = e.message
      }
    },
  },
}
</script>
