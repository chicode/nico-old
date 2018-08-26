<template>
  <div class="root">
    <div>
      <button
        v-for="tool in tools"
        :key="tool"
        class="tool"
        @click="switchTool(tool)"
      >
        <img :src="`tools/${tool}.svg`">
      </button>
    </div>
    <div>
      <canvas ref="main" />
      <canvas ref="grid" />
      <canvas ref="overlay" />
    </div>
  </div>
</template>

<script>
import {
  handleSpritesheetAction,
  getCtx,
  getCtxParamsForSelection,
  SCALE,
  CANVAS_SIZE,
  GRID_SIZE,
  GRID_NUMBER,
} from '@/store'

function initCanvas (canvas) {
  canvas.width = CANVAS_SIZE * SCALE
  canvas.height = CANVAS_SIZE * SCALE
}

function initCtx (ctx) {
  ctx.imageSmoothingEnabled = false
  ctx.scale(SCALE, SCALE)
}

export default {
  name: 'Sprite',

  data: function () {
    return {
      mainCtx: null,
      mouseDown: false,
      tool: 'pencil',
      tools: [
        'pencil',
        'eraser',
        'rectangle-select',
        'circle-select',
        'similar-select',
        'pencil-select',
      ],
      toolOptions: {
        width: 1,
        color: 'black',
      },
      selectStart: [0, 0],
      selectSize: [0, 0],
    }
  },

  computed: {
    toolType () {
      return ['pencil', 'eraser'].includes(this.tool) ? 'action' : 'select'
    },
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
      initCtx(this.mainCtx)
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
      this.overlayCtx = el.getContext('2d')
      initCtx(this.overlayCtx)
      this.overlayCtx.setLineDash([1, 1])
      this.overlayCtx.strokeStyle = 'blue'

      el.addEventListener('mousedown', (event) => {
        this.onChange(event, 'down')
      })

      el.addEventListener('mousemove', (event) => {
        if (this.mouseDown) this.onChange(event, 'move')
      })
    },

    onChange (event, eventType) {
      let x = Math.floor((event.pageX - this.main.offsetLeft) / SCALE)
      let y = Math.floor((event.pageY - this.main.offsetTop) / SCALE)

      if (this.toolType === 'action') {
        let action
        if (eventType === 'down' && this.selectionContains(x, y)) {
          action = {
            tool: this.tool,
            type: 'selection',
            selectStart: this.selectStart,
            selectSize: this.selectSize,
            color: this.toolOptions.color,
          }
        } else {
          if (eventType === 'down') {
            this.overlayCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
            this.selectSize = [0, 0]
          }
          action = {
            tool: this.tool,
            type: 'tool',
            coords: [x, y],
            color: this.toolOptions.color,
            width: this.toolOptions.width,
          }
        }

        this.$store.commit('changeSpritesheet', action)
        handleSpritesheetAction(action, this.mainCtx)
      } else {
        if (eventType === 'down') {
          this.selectStart = [x, y]
          this.selectSize = [0, 0]
          this.overlayCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
        } else {
          this.drawSelect(x, y)
        }
      }
    },

    updateCanvas () {
      let { canvas } = getCtx(this.$store.state.spritesheet)
      this.mainCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
      this.mainCtx.drawImage(canvas, 0, 0)
    },

    switchTool (tool) {
      this.tool = tool
    },

    drawSelect (x, y) {
      // clear the previous selection
      let params = getCtxParamsForSelection(this.selectStart, this.selectSize)

      // - 1, + 2 is to account for the border
      // 0.5 is to offset the border so that it appears inline with the drawing
      this.overlayCtx.clearRect(params[0] - 1 + 0.5, params[1] - 1 + 0.5, params[2] + 2 - 0.5, params[3] + 2 - 0.5)

      this.selectSize = [x - this.selectStart[0], y - this.selectStart[1]]

      this.overlayCtx.strokeRect(this.selectStart[0] + 0.5, this.selectStart[1] + 0.5, this.selectSize[0], this.selectSize[1])
    },

    selectionContains (x, y) {
      let params = getCtxParamsForSelection(this.selectStart, this.selectSize)
      return x >= params[0] && y >= params[1] && x < params[0] + params[2] && params[1] + params[3]
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

.tool {
  img {
    width: 30px;
  }
}
</style>
