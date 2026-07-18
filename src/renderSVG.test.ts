import { describe, expect, it } from 'vitest'
import { renderTemplateToSVG } from './renderSVG.js'
import { templates } from './templates/index.js'
import type { Template } from './types.js'

// Vitest runs in plain Node with no ImageData constructor; the renderer only
// reads .width/.height/.data, so a structural stand-in is enough.
function makeImageData(width: number, height: number, [r, g, b]: [number, number, number]): ImageData {
  const data = new Uint8ClampedArray(width * height * 4)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = r
    data[i + 1] = g
    data[i + 2] = b
    data[i + 3] = 255
  }
  return { width, height, data, colorSpace: 'srgb' } as ImageData
}

describe('renderTemplateToSVG', () => {
  it('sizes the document from imageData dimensions and scale', () => {
    const svg = renderTemplateToSVG(makeImageData(20, 10, [255, 255, 255]), templates.ascii, {
      resolution: 10,
      scale: 2,
    })
    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20" viewBox="0 0 40 20">')
    expect(svg.match(/<text /g)).toHaveLength(2)
  })

  it('collapses a uniform background into a single base rect', () => {
    const svg = renderTemplateToSVG(makeImageData(20, 20, [255, 255, 255]), templates.ascii, {
      resolution: 10,
    })
    expect(svg.match(/<rect /g)).toHaveLength(1)
    expect(svg).toContain('<rect width="20" height="20" fill="black"/>')
  })

  it('emits centered glyphs and skips blank cells', () => {
    const white = renderTemplateToSVG(makeImageData(10, 10, [255, 255, 255]), templates.ascii, {
      resolution: 10,
    })
    expect(white).toContain('text-anchor="middle" dominant-baseline="central"')
    expect(white).toContain('<text x="5" y="5" fill="white">@</text>')

    // ascii maps black to a space glyph — nothing visible to emit.
    const black = renderTemplateToSVG(makeImageData(10, 10, [0, 0, 0]), templates.ascii, {
      resolution: 10,
    })
    expect(black).not.toContain('<text')
  })

  it('lowres emits per-cell backgrounds and no text', () => {
    const svg = renderTemplateToSVG(makeImageData(10, 10, [10, 20, 30]), templates.lowres, {
      resolution: 10,
    })
    expect(svg).toContain('fill="rgb(10,20,30)"')
    expect(svg).not.toContain('<text')
  })

  it('resolves font like renderTemplateToContext: option, then meta, then default', () => {
    const image = makeImageData(10, 10, [255, 255, 255])
    const byDefault = renderTemplateToSVG(image, templates.ascii, { resolution: 10 })
    expect(byDefault).toContain('font-family="Space Mono" font-size="10" font-weight="400"')

    const byOption = renderTemplateToSVG(image, templates.ascii, {
      resolution: 10,
      scale: 2,
      font: { family: 'VT323', weight: 700 },
    })
    expect(byOption).toContain('font-family="VT323" font-size="20" font-weight="700"')

    const withMeta: Template = Object.assign(
      ((r: number, g: number, b: number) => templates.ascii(r, g, b)) as Template,
      { meta: { fontScale: 0.5, fontFamily: 'Courier New', fontWeight: 300 } }
    )
    const byMeta = renderTemplateToSVG(image, withMeta, { resolution: 10 })
    expect(byMeta).toContain('font-family="Courier New" font-size="5" font-weight="300"')
  })

  it('XML-escapes glyphs and colors', () => {
    const angly: Template = () => ({ char: '<', color: 'white', background: 'black' })
    expect(renderTemplateToSVG(makeImageData(10, 10, [0, 0, 0]), angly, { resolution: 10 })).toContain(
      '>&lt;</text>'
    )
    const ampy: Template = () => ({ char: '&', color: 'white', background: 'black' })
    expect(renderTemplateToSVG(makeImageData(10, 10, [0, 0, 0]), ampy, { resolution: 10 })).toContain(
      '>&amp;</text>'
    )
  })

  it('inlines an embedded font as a base64 @font-face', () => {
    const svg = renderTemplateToSVG(makeImageData(10, 10, [255, 255, 255]), templates.ascii, {
      resolution: 10,
      embeddedFont: { family: 'Space Mono', weight: 400, format: 'woff2', data: new Uint8Array([0, 1, 2]) },
    })
    expect(svg).toContain('<style>@font-face{font-family:"Space Mono";font-weight:400;')
    expect(svg).toContain('src:url(data:font/woff2;base64,AAEC) format("woff2")')
  })

  it('passes a prebuilt data: URI through verbatim', () => {
    const svg = renderTemplateToSVG(makeImageData(10, 10, [255, 255, 255]), templates.ascii, {
      resolution: 10,
      embeddedFont: { family: 'Space Mono', data: 'data:font/woff2;base64,QUJD' },
    })
    expect(svg).toContain('src:url(data:font/woff2;base64,QUJD)')
  })
})
