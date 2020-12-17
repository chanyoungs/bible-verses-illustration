export const playSound = (charCodes, instruments) => {
  const instrumentOrders = ["flute", "cello", "organ"]
  charCodes.forEach((component, i) => {
    if (component === 0 && i === 2) return null
    // No end component
    else {
      let base
      if (i === 0) base = 12
      else if (i === 1) base = 0
      else base = -12

      base -= 12

      const frequency = Math.pow(2, (base + component) / 12) * 220
      instruments[instrumentOrders[i]].triggerAttackRelease(frequency, 1)
    }
  })
}
