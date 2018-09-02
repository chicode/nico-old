<template>
  <div
    class="root"
  >
    <div class="controls">
      <Toolbar />
      <div>
        <div v-if="tool === 'pencil'">
          <ColorPicker />
        </div>
        <div v-else-if="tool === 'eraser'" />
      </div>
    </div>
    <div>
      <GridCanvas/>
      <MainCanvas />
      <OverlayCanvas ref="canvas"/>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { SCALE } from './constants'

import ColorPicker from './components/ColorPicker'
import Toolbar from './components/Toolbar'
import GridCanvas from './components/GridCanvas'
import MainCanvas from './components/MainCanvas'
import OverlayCanvas from './components/OverlayCanvas'

export default {
  name: 'Sprite',

  components: {
    ColorPicker, GridCanvas, MainCanvas, OverlayCanvas, Toolbar,
  },

  computed: {
    ...mapState('sprite', ['tool', 'spritesheet']),
  },

  mounted () {
    const el = this.$refs.canvas.$el
    const f = this.getCoordsFromEvent
    el.addEventListener('mousedown', (event) => this.mouseDown(f(event)))
    el.addEventListener('mouseup', (event) => this.mouseUp(f(event)))
    el.addEventListener('mousemove', (event) => this.mouseMove(f(event)))

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
    ...mapActions('sprite', ['mouseDown', 'mouseUp', 'mouseMove']),
    ...mapActions('history', ['undo', 'redo']),

    getCoordsFromEvent (event) {
      return [
        event.offsetX,
        event.offsetY,
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
