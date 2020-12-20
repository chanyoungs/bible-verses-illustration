import { components } from "./references"

export const soundPlayerLoader = (
  charCode,
  componentIndex,
  instruments,
  frequencyMode
) => {
  if (componentIndex === 2) {
    if (charCode === 0) return null
    else charCode--
  }

  let base
  switch (componentIndex) {
    case 0:
      base = -12
      break
    case 1:
      base = -12
      break
    case 2:
      base = -24
      break
    default:
      break
  }

  let frequency
  switch (frequencyMode) {
    case 0:
      frequency = getFrequency(base, degreeToNote(charCode))
      break
    case 1:
      frequency = getFrequency(base, charCode)
      break
    default:
      break
  }

  instruments[componentIndex].triggerAttackRelease(frequency, 1)
}

const rootFrequency = 220

const getFrequency = (base, note) =>
  Math.pow(2, (base + note) / 12) * rootFrequency

const degreeToNote = (scaleDegree) => {
  const scaleIntervals = [0, 2, 4, 5, 7, 9, 11]
  // scaleDegree--
  return (
    Math.floor(scaleDegree / 7) * 12 +
    scaleIntervals[(scaleDegree + 7 * 10) % 7]
  )
}
