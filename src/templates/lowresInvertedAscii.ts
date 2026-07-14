import type { Template } from '../types.js'

const chars = [' ', 'f', '0', 'W', '.', 'j', 'O', '&', ',', 'r', 'Z', '8', ':', 'x', 'm', '%', ';', 'n', 'w', 'B', 'i', 'u', 'q', '@', 'l', 'v', 'p', '$', '!', 'c', 'd', 'Q', 'I', 'z', 'b', 'G', '|', 'X', 'k', 'R', '/', 'Y', 'h', 'S', '/', 'U', 'a', 'A', '(', 'J', 'o', 'E', ')', 'C', '*', 'F', '1', 'L', '#', 'H', 't', 'Q', 'M', 'T']

const lowresInvertedAscii: Template = (r, g, b) => {
  const brightness = (r + g + b) / 3
  const char = chars[Math.floor((brightness / 255) * (chars.length - 1))]
  // perceived luminance — weights match human eye sensitivity
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  const color = luminance > 128 ? 'black' : 'white'
  return { char, color, background: `rgb(${r},${g},${b})` }
}

export default lowresInvertedAscii
