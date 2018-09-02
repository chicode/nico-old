import { SCALE, CANVAS_SIZE, CANVAS_PADDING } from './constants'

export function scale (...values) {
  return values.map((value) => value * SCALE)
}

// create a ctx based on some imagedata
// uses a global ctx variable to prevent making a new canvas on every call
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

export function getCanvasFromData (data) {
  let imageData = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE)
  imageData.data.set(data)
  ctx.putImageData(imageData, 0, 0)
  return canvas
}

export function getDataFromCtxOperations (func) {
  func(ctx)
  return getDataFromCtx(ctx)
}

const scaledCanvas = document.createElement('canvas')
initCanvas(scaledCanvas)
const scaledCtx = scaledCanvas.getContext('2d')
initCtx(scaledCtx)

export function scaleCanvas (canvas) {
  scaledCtx.drawImage(canvas, 0, 0)
  return scaledCtx
}

export function initCanvas (canvas, padding = 0) {
  canvas.width = CANVAS_SIZE * SCALE + padding * 2
  canvas.height = CANVAS_SIZE * SCALE + padding * 2
}

export function initCtx (ctx) {
  ctx.imageSmoothingEnabled = false
  ctx.scale(SCALE, SCALE)
}

export function clearCtx (ctx) {
  // add canvas padding just in case
  // if the size goes over the size of the canvas ctx doesn't complain
  ctx.clearRect(
    -CANVAS_PADDING,
    -CANVAS_PADDING,
    CANVAS_SIZE * SCALE + CANVAS_PADDING * 2,
    CANVAS_SIZE * SCALE + CANVAS_PADDING * 2,
  )
}

export function getDataFromCtx (ctx) {
  return ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data
}
