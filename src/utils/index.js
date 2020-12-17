export const getCharacterComponents = (char) => {
  let codePoint = char.codePointAt(0)
  if (codePoint !== undefined) {
    const initIndex = Math.floor((codePoint - 44032) / 588)
    const midIndex = Math.floor(((codePoint - 44032) % (21 * 28)) / 28)
    const endIndex = ((codePoint - 44032) % (21 * 28)) % 28

    return [initIndex, midIndex, endIndex]
  }
}

export const testKorean = (char) => {
  const korean = /[\u3131-\uD79D]/giu
  return korean.test(char)
}
