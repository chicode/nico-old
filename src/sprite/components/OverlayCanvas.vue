<template>
  <canvas ref="overlay" />
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import { initCanvas, clearCtx, scale } from '../helpers'
import { SELECTION_WIDTH, SELECTION_COLOR, SELECTION_DASH } from '../constants'

export default {
  name: 'OverlayCanvas',

  computed: {
    ...mapState('sprite', ['selectStart', 'selectSize']),
  },

  watch: {
    selectStart () {
      this.drawSelect()
    },
    selectSize () {
      this.drawSelect()
    },
  },

  mounted () {
    const el = this.$refs.overlay
    initCanvas(el)
    this.overlayCtx = el.getContext('2d')
    this.overlayCtx.setLineDash(SELECTION_DASH)
    this.overlayCtx.strokeStyle = SELECTION_COLOR
    this.overlayCtx.lineWidth = SELECTION_WIDTH
  },

  methods: {
    ...mapMutations('sprite', ['setSelectSize']),
    drawSelect (x, y) {
      clearCtx(this.overlayCtx)

      this.overlayCtx.strokeRect(...scale(this.selectStart[0], this.selectStart[1], this.selectSize[0], this.selectSize[1]))
    },
  },
}
</script>
