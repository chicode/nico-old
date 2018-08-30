<template>
  <canvas ref="grid" />
</template>
<script>
import { initCanvas } from '../helpers'
import { GRID_SIZE, GRID_NUMBER, SCALE, CANVAS_SIZE } from '../constants'

export default {
  name: 'GridCanvas',

  mounted () {
    const el = this.$refs.grid
    initCanvas(el)

    let ctx = el.getContext('2d')
    ctx.beginPath()
    ctx.strokeStyle = '#7396af'
    ctx.fillStyle = '#7396af'
    ctx.font = 'bold 10px Source Code Pro'
    ctx.lineWidth = 2
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
}
</script>
