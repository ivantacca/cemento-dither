import type { Template } from '../types.js'

const ramp = [
  { char: ' ', color: '#A5A8A2', background: '#000000' },
  { char: ' ', color: '#A5A8A2', background: '#000000' },
  { char: ' ', color: '#A5A8A2', background: '#000000' },
  { char: '*', color: '#EAEC0D', background: '#000DFF' },
  { char: 'E', color: '#EAEC0D', background: '#000DFF' },
  { char: 'E', color: '#FFFFFF', background: '#000DFF' },
  { char: 'E', color: '#FFFFFF', background: '#000DFF' },
  { char: 'E', color: '#FFFFFF', background: '#000DFF' },
  { char: 'C', color: '#000000', background: '#FF1800' },
  { char: '0', color: '#000000', background: '#FF1800' },
  { char: '3', color: '#FFFFFF', background: '#FF1800' },
  { char: 'E', color: '#FFFFFF', background: '#FF1800' },
  { char: 'C', color: '#000000', background: '#FFFFFF' },
  { char: 'E', color: '#000000', background: '#FFFFFF' },
  { char: 'M', color: '#000000', background: '#FFFFFF' },
  { char: 'O', color: '#000000', background: '#FFFFFF' },
  { char: 'T', color: '#000000', background: '#FFFFFF' },
  { char: 'N', color: '#000000', background: '#FFFFFF' },
  { char: 'M', color: '#000000', background: '#FFFFFF' },
  { char: 'M', color: '#000000', background: '#FFFFFF' },
]

const analog: Template = (r, g, b) => {
  const brightness = (r + g + b) / 3
  return ramp[Math.floor((brightness / 255) * (ramp.length - 1))]
}

export default analog
