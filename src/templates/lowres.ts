import type { Template } from '../types.js'

const lowres: Template = (r, g, b) => ({
  char: ' ',
  color: 'transparent',
  background: `rgb(${r},${g},${b})`,
})

export default lowres
