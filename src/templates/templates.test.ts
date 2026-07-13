import { describe, expect, it } from 'vitest'
import { templates, TEMPLATE_NAMES } from './index.js'

describe('templates', () => {
  it('exposes all 5 templates', () => {
    expect(TEMPLATE_NAMES.sort()).toEqual(
      ['analog', 'ascii', 'lowres', 'lowresInvertedAscii', 'sorted'].sort()
    )
  })

  it.each(TEMPLATE_NAMES)('%s returns a valid pixel for black and white input', (name) => {
    const template = templates[name]
    for (const [r, g, b] of [[0, 0, 0], [255, 255, 255]] as const) {
      const pixel = template(r, g, b)
      expect(typeof pixel.char).toBe('string')
      expect(typeof pixel.color).toBe('string')
      expect(typeof pixel.background).toBe('string')
    }
  })

  it('ascii maps black to a space on black background', () => {
    expect(templates.ascii(0, 0, 0)).toEqual({ char: ' ', color: 'white', background: 'black' })
  })

  it('lowres echoes the input rgb as the background', () => {
    expect(templates.lowres(10, 20, 30)).toEqual({
      char: ' ',
      color: 'transparent',
      background: 'rgb(10,20,30)',
    })
  })

  it('lowresInvertedAscii exposes fontFamily meta', () => {
    expect(templates.lowresInvertedAscii.meta).toEqual({ fontWeight: 400, fontFamily: 'Roboto Mono' })
  })
})
