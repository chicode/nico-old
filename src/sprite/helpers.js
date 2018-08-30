import { SCALE, CANVAS_SIZE } from './constants'

export function scale (...values) {
  return values.map((value) => value * SCALE)
}

// create a ctx based on some imagedata
// uses a global ctx variable to prevent making a new canvas on every call
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

export function getCtx (data) {
  let imageData = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE)
  imageData.data.set(data)
  ctx.putImageData(imageData, 0, 0)
  return { canvas, ctx }
}

const scaledCanvas = document.createElement('canvas')
initCanvas(scaledCanvas)
const scaledCtx = scaledCanvas.getContext('2d')
initCtx(scaledCtx)

export function scaleCanvas (canvas) {
  scaledCtx.drawImage(canvas, 0, 0)
  return scaledCtx
}

export function initCanvas (canvas) {
  canvas.width = CANVAS_SIZE * SCALE
  canvas.height = CANVAS_SIZE * SCALE
}

export function initCtx (ctx) {
  ctx.imageSmoothingEnabled = false
  ctx.scale(SCALE, SCALE)
}

export function clearCtx (ctx) {
  ctx.clearRect(0, 0, CANVAS_SIZE * SCALE, CANVAS_SIZE * SCALE)
}

export function getImageData (ctx) {
  return ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data
}
