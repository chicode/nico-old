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

// these two function process drawing information to work with ctx functions
export function getCtxParamsForSelection (start, size) {
  // if the selection is in the negative direction (up or left), reverse it
  // and start deleting from its top left corner
  // this is done because clearRect/fillRect doesn't work with negative widths/heights
  return [
    start[0] + (size[0] < 0 ? size[0] : 0),
    start[1] + (size[1] < 0 ? size[1] : 0),
    Math.abs(size[0]),
    Math.abs(size[1]),
  ]
}

export function getCtxParamsForAction (coords, width) {
  return [coords[0] - Math.floor(width / 2), coords[1] - Math.floor(width / 2), width, width]
}

export function handleSpritesheetAction (action, ctx) {
  let params
  if (action.type === 'selection') {
    params = getCtxParamsForSelection(action.selectStart, action.selectSize)
  } else {
    params = getCtxParamsForAction(action.coords, action.width)
  }

  if (action.tool === 'pencil') {
    ctx.fillStyle = action.color
    ctx.fillRect(...params)
  } else if (action.tool === 'eraser') {
    ctx.clearRect(...params)
  }
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
