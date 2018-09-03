import { CANVAS_SIZE } from './constants'

function getIndexFromCoords (coords) {
  return coords[1] * (CANVAS_SIZE * 4) + coords[0] * 4
}

function inBounds (coords) {
  return coords[0] >= 0 && coords[0] < CANVAS_SIZE && coords[1] >= 0 && coords[1] < CANVAS_SIZE
}

function getColor (data, coords) {
  const i = getIndexFromCoords(coords)
  return [data[i], data[i + 1], data[i + 2], data[i + 3]].join(',')
}

function setPixel (data, coords, color) {
  const i = getIndexFromCoords(coords)
  const [red, green, blue] = color
  data[i] = red
  data[i + 1] = green
  data[i + 2] = blue
  data[i + 3] = 255
}

function hexToRgb (hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null
}

function search (data, coords, color, traversed) {
  for (const direction of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
    let newCoords = [coords[0] + direction[0], coords[1] + direction[1]]
    if (
      // new coordinate is of the right color and has not already been added
      inBounds(newCoords) &&
      getColor(data, newCoords) === color &&
      traversed.reduce(
        (acc, val) => acc && !(val[0] === newCoords[0] && val[1] === newCoords[1]),
        true,
      )
    ) {
      traversed.push(newCoords)
      search(data, newCoords, color, traversed)
    }
  }
  return traversed
}

export default function bucketFill (data, initialCoords, color) {
  // returning a new array is necessary for vuex to detect the change
  data = data.slice()

  color = hexToRgb(color)
  if (!color) throw new Error('Bucket fill color must be in hex')

  const allCoords = search(data, initialCoords, getColor(data, initialCoords), [initialCoords])
  for (let coords of allCoords) {
    setPixel(data, coords, color)
  }
  return data
}
