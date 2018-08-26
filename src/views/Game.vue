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
    ...mapState(['running', 'paused', 'view']),
    mainCtx () {
      return this.$refs.mainCanvas.getContext('2d')
    },
  },

  watch: {
    view (view) {
      if (view === 'game' && this.running) this.init()
    },
    running (running) {
      if (running) this.init()
    },
  },

  mounted () {
    this.init()
  },

  methods: {
    init () {
      this.error = ''

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

      try {
        // eslint-disable-next-line
        eval(this.$store.state.compiledCode)
      } catch (e) {
        this.error = e.message
        this.$store.state.running = false
      }
    },
  },
}
</script>
