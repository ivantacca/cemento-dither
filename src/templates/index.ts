import ascii from './ascii.js'
import analog from './analog.js'
import sorted from './sorted.js'
import lowres from './lowres.js'
import lowresInvertedAscii from './lowresInvertedAscii.js'
import type { Template } from '../types.js'

export const templates: Record<string, Template> = {
  ascii,
  analog,
  sorted,
  lowres,
  lowresInvertedAscii,
}

export const TEMPLATE_NAMES = Object.keys(templates)

export { ascii, analog, sorted, lowres, lowresInvertedAscii }
