import type { Template } from '../types.js'

const ramp = [
  { char: ' ', color: 'white', background: 'black' },
  { char: ';', color: 'white', background: 'black' },
  { char: '+', color: 'white', background: 'black' },
  { char: '*', color: 'white', background: 'black' },
  { char: '?', color: 'white', background: 'black' },
  { char: '%', color: 'white', background: 'black' },
  { char: 'S', color: 'white', background: 'black' },
  { char: '#', color: 'white', background: 'black' },
  { char: '@', color: 'white', background: 'black' },
]

const ascii: Template = (r, g, b) => {
  const brightness = (r + g + b) / 3
  return ramp[Math.floor((brightness / 255) * (ramp.length - 1))]
}

export default ascii
