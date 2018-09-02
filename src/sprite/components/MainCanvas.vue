<template>
  <canvas
    ref="main"
    :style="{ margin: $options.CANVAS_PADDING + 'px' }"
  />
</template>

<script>
import { mapState } from 'vuex'
import { initCanvas, initCtx, clearCtx, getCanvasFromData } from '../helpers'
import { CANVAS_PADDING } from '../constants'

export default {
  name: 'MainCanvas',

  CANVAS_PADDING,

  computed: {
    ...mapState('sprite', ['spritesheet']),
  },

  watch: {
    spritesheet () {
      this.updateCanvas()
    },
  },

  mounted () {
    const el = this.$refs.main
    initCanvas(el)
    this.main = el
    this.mainCtx = el.getContext('2d')
    initCtx(this.mainCtx)

    this.updateCanvas()
  },

  methods: {
    updateCanvas () {
      let canvas = getCanvasFromData(this.spritesheet)
      clearCtx(this.mainCtx)
      this.mainCtx.drawImage(canvas, 0, 0)
    },
  },
}
</script>
