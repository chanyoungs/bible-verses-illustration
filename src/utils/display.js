import { charToHSV, initials, middles, ends } from "../references"

export const displayCharacters = ({
  p5,
  charCodes,
  interval,
  timeNow,
  fadeOut,
  noAlpha = false,
  gridWidth = p5.width * 0.9,
  gridHeight = p5.height * 0.5,
  x = (p5.width - gridWidth) / 2,
  y = 50
}) => {
  if (!charCodes) return null

  const initialAtomic = initials[charCodes[0]].atomic
  const middleAtomic = middles[charCodes[1]].atomic
  const endAtomic = ends[charCodes[2]].atomic

  const verticalGrids =
    (initialAtomic.length > 0) +
    (middleAtomic[0].length > 0) +
    (endAtomic.length > 0)
  const horizontalGrids =
    (initialAtomic.length > 0) + (middleAtomic[1].length > 0)

  const Atomics = [initialAtomic, ...middleAtomic, endAtomic]
  let totalGrids = 0
  Atomics.forEach((atom) => (totalGrids += atom.length))

  const timeInterval = interval / totalGrids
  let timeIndex = totalGrids

  Atomics.forEach((atomic, i) => {
    if (atomic.length > 0) {
      const direction = i === 1 ? "vertical" : "horizontal"
      const xStart = x + (i === 2 ? gridWidth / 2 : 0)
      const xEnd = x + gridWidth / (i < 2 ? horizontalGrids : 1)

      let yStart
      if (i === 0 || i === 2) yStart = y
      else if (i === 1) yStart = y + gridHeight / verticalGrids
      else if (i === 3)
        yStart =
          y + (gridHeight * (1 + (middleAtomic[0].length > 0))) / verticalGrids

      let yEnd
      if (i === 2)
        yEnd = y + (1 - (endAtomic.length > 0) / verticalGrids) * gridHeight
      else yEnd = yStart + gridHeight / verticalGrids

      let xRect = xStart
      let yRect = yStart
      let lengthX =
        (xEnd - xStart) / (direction === "horizontal" ? atomic.length : 1)
      let lengthY =
        (yEnd - yStart) / (direction === "vertical" ? atomic.length : 1)

      atomic.forEach((char, i) => {
        if (direction === "horizontal") xRect = xStart + i * lengthX
        else yRect = yStart + i * lengthY
        const alpha = fadeOut
          ? timeNow / timeInterval
          : noAlpha
          ? 1
          : (timeIndex * timeInterval - timeNow) / timeInterval
        p5.fill(...charToHSV[char], alpha)
        p5.rect(xRect, yRect, lengthX, lengthY)
        timeIndex--
      })
    }
  })
}
