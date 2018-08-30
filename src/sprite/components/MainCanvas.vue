<template>
  <canvas ref="main" />
</template>

<script>
import { mapState } from 'vuex'
import { initCanvas, initCtx, clearCtx, getCtx } from '../helpers'
import { CANVAS_SIZE } from '../constants'

export default {
  name: 'MainCanvas',

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
      let { canvas } = getCtx(this.spritesheet)
      clearCtx(this.mainCtx)
      this.mainCtx.drawImage(canvas, 0, 0)
    },
  },
}
</script>
