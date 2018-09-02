<template>
  <div
    class="root"
  >
    <div class="controls">
      <ToolBar />
      <OptionBar />
    </div>
    <div>
      <GridCanvas />
      <MainCanvas />
      <OverlayCanvas ref="canvas" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { SCALE, CANVAS_PADDING, CANVAS_PADDING_OUTER } from './constants'

import ToolBar from './components/ToolBar'
import OptionBar from './components/OptionBar'

import GridCanvas from './components/GridCanvas'
import MainCanvas from './components/MainCanvas'
import OverlayCanvas from './components/OverlayCanvas'

export default {
  name: 'Sprite',

  components: {
    GridCanvas, MainCanvas, OverlayCanvas, ToolBar, OptionBar,
  },

  mounted () {
    const el = this.$refs.canvas.$el
    const f = this.getCoordsFromEvent
    el.addEventListener('mousedown', (event) => this.mouseDown(f(event)))
    el.addEventListener('mousemove', (event) => this.mouseMove(f(event)))
    el.addEventListener('mouseup', this.mouseUp)
    el.addEventListener('mouseleave', this.mouseLeave)

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Control') window.control = true

      else if (event.key === 'Z' && window.control) this.redo()
      else if (event.key === 'z' && window.control) this.undo()
    })

    document.addEventListener('keyup', (event) => {
      if (event.key === 'Control') window.control = false
    })
  },

  methods: {
    ...mapActions('sprite', ['mouseDown', 'mouseUp', 'mouseMove', 'mouseLeave']),
    ...mapActions('history', ['undo', 'redo']),

    getCoordsFromEvent (event) {
      return [
        event.offsetX - CANVAS_PADDING_OUTER - CANVAS_PADDING,
        event.offsetY - CANVAS_PADDING_OUTER - CANVAS_PADDING,
      ].map(coord => Math.floor(coord / SCALE))
    },
  },
}
</script>

<style scoped lang="stylus">
.root {
  canvas {
    position: absolute;
  }
  canvas:last-of-type {
    position: relative;
  }

}
.controls {
  display: flex;
  align-items: center;
  & > * {
    margin-right: 50px;
  }
  margin: 10px 0;
}

</style>
