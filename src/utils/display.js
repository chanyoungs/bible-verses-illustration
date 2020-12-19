import { charToHSV, initials, middles, ends } from "./references"
let testerCount = 10
const tester = (...log) => {
  if (testerCount > 0) {
    console.log(...log)
    testerCount--
  }
}
export const charactersDisplayerLoader = ({
  p5,
  charCodes,
  interval,
  timeNow,
  fadeOut,
  stopped,
  noAlpha = false,
  gridWidth = Math.min(p5.width, p5.height) * 0.9,
  gridHeight = Math.min(p5.width, p5.height) * 0.9,
  x = (p5.width - gridWidth) / 2,
  y = (p5.height - gridHeight) / 2,
  displayMode,
  soundPlayer,
  instrumentsPlayMode,
  instrumentsPlayStatus
}) => {
  if (!charCodes || stopped) return null

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
  const cumulativeTimeIndices = []

  Atomics.forEach((atom, i) => {
    if (i !== 2) cumulativeTimeIndices.push(totalGrids)
    totalGrids += atom.length
  })

  const timeInterval = interval / totalGrids
  let timeIndex = totalGrids

  Atomics.forEach((atomic, componentIndex) => {
    if (
      instrumentsPlayMode === 1 &&
      !noAlpha &&
      !fadeOut &&
      instrumentsPlayStatus[componentIndex] &&
      cumulativeTimeIndices[componentIndex] * timeInterval <= interval - timeNow
    ) {
      soundPlayer(charCodes[componentIndex], componentIndex)
      instrumentsPlayStatus[componentIndex] = false
    }

    if (atomic.length > 0) {
      const direction = componentIndex === 1 ? "vertical" : "horizontal"
      const xStart = x + (componentIndex === 2 ? gridWidth / 2 : 0)
      const xEnd = x + gridWidth / (componentIndex < 2 ? horizontalGrids : 1)

      let yStart
      if (componentIndex === 0 || componentIndex === 2) yStart = y
      else if (componentIndex === 1) yStart = y + gridHeight / verticalGrids
      else if (componentIndex === 3)
        yStart =
          y + (gridHeight * (1 + (middleAtomic[0].length > 0))) / verticalGrids

      let yEnd
      if (componentIndex === 2)
        yEnd = y + (1 - (endAtomic.length > 0) / verticalGrids) * gridHeight
      else yEnd = yStart + gridHeight / verticalGrids

      let xRect = xStart
      let yRect = yStart
      let lengthX =
        (xEnd - xStart) / (direction === "horizontal" ? atomic.length : 1)
      let lengthY =
        (yEnd - yStart) / (direction === "vertical" ? atomic.length : 1)

      atomic.forEach((char, charIndex) => {
        if (direction === "horizontal") xRect = xStart + charIndex * lengthX
        else yRect = yStart + charIndex * lengthY
        const alpha = fadeOut
          ? timeNow / timeInterval
          : noAlpha
          ? 1
          : (timeIndex * timeInterval - timeNow) / timeInterval
        p5.fill(...charToHSV[char], alpha)
        if (displayMode === 1) {
          p5.rectMode(p5.CORNERS)
          p5.rect(xRect, yRect, x + gridWidth, y + gridHeight)
          p5.rectMode(p5.CORNER)
        } else p5.rect(xRect, yRect, lengthX, lengthY)
        timeIndex--
      })
    }
  })
}
