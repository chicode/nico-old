<template>
  <div class="root">
    <Toolbar />
    <div>
      <div v-if="tool === 'pencil'">
        <ColorPicker />
      </div>
      <div v-else-if="tool === 'eraser'"/>
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
  },

  methods: {
    ...mapActions('sprite', ['mouseDown', 'mouseUp', 'mouseMove']),

    getCoordsFromEvent (event) {
      return [
        event.offsetX,
        event.offsetY,
      ]
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
</style>