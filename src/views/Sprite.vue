<template>
  <div class="root">
    <canvas ref="main" />
    <canvas ref="grid" />
    <canvas ref="overlay" />
  </div>
</template>

<script>
import {
  handleSpritesheetAction,
  getCtx,
  SCALE,
  CANVAS_SIZE,
  GRID_SIZE,
  GRID_NUMBER,
} from '@/store'

function initCanvas (canvas) {
  canvas.width = CANVAS_SIZE * SCALE
  canvas.height = CANVAS_SIZE * SCALE
}

export default {
  name: 'Sprite',

  data: function () {
    return {
      mainCtx: null,
      mouseDown: false,
      tool: 'pencil',
      toolOptions: {
        width: 1,
        color: 'black',
      },
    }
  },

  mounted () {
    this.initMain()
    this.initGrid()
    this.initOverlay()

    window.addEventListener('mousedown', () => (this.mouseDown = true))
    window.addEventListener('mouseup', () => (this.mouseDown = false))

    this.updateCanvas()
  },

  updated () {
    this.updateCanvas()
  },

  methods: {
    initMain () {
      const el = this.$refs.main
      initCanvas(el)
      this.main = el
      this.mainCtx = el.getContext('2d')
      this.mainCtx.imageSmoothingEnabled = false
      this.mainCtx.scale(SCALE, SCALE)
    },

    initGrid () {
      const el = this.$refs.grid
      initCanvas(el)

      let ctx = el.getContext('2d')
      ctx.beginPath()
      ctx.strokeStyle = '#7396af'
      ctx.fillStyle = '#7396af'
      ctx.font = 'bold 10px Source Code Pro'
      ctx.lineWidth = 5
      let begin, end
      for (let x = 0; x <= GRID_NUMBER; x++) {
        begin = [x * GRID_SIZE * SCALE, 0]
        end = [x * GRID_SIZE * SCALE, CANVAS_SIZE * SCALE]
        ctx.moveTo(begin[0], begin[1])
        ctx.lineTo(end[0], end[1])
      }
      for (let y = 0; y <= GRID_NUMBER; y++) {
        begin = [0, y * GRID_SIZE * SCALE]
        end = [CANVAS_SIZE * SCALE, y * GRID_SIZE * SCALE]
        ctx.moveTo(begin[0], begin[1])
        ctx.lineTo(end[0], end[1])
      }
      for (let x = 0; x <= GRID_NUMBER; x++) {
        for (let y = 0; y <= GRID_NUMBER; y++) {
          ctx.fillText(x + GRID_NUMBER * y, x * GRID_SIZE * SCALE + 4, y * GRID_SIZE * SCALE + 12)
        }
      }
      ctx.stroke()
    },

    initOverlay () {
      const el = this.$refs.overlay
      initCanvas(el)
      el.addEventListener('mousemove', (event) => {
        if (this.mouseDown && !window.dragging) this.onChange(event)
      })
    },

    onChange (event) {
      let x = Math.floor((event.pageX - this.main.offsetLeft) / SCALE)
      let y = Math.floor((event.pageY - this.main.offsetTop) / SCALE)

      let action = {
        tool: this.tool,
        x,
        y,
        color: this.toolOptions.color,
        width: this.toolOptions.width,
      }

      this.$store.commit('changeSpritesheet', action)
      handleSpritesheetAction(action, this.mainCtx)
    },

    updateCanvas () {
      let { canvas } = getCtx(this.$store.state.spritesheet)
      this.mainCtx.clearRect(0, 0, CANVAS_SIZE * SCALE, CANVAS_SIZE * SCALE)
      this.mainCtx.drawImage(canvas, 0, 0)
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
