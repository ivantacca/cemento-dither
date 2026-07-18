import { DEFAULT_FONT, type RenderTemplateOptions } from './renderFrame.js'
import type { Pixel, Template } from './types.js'

/** A font to inline into the SVG as a base64 `@font-face`, so it renders standalone. */
export interface EmbeddedFont {
  family: string
  /** Defaults to 400. */
  weight?: number
  /** Defaults to 'woff2'. */
  format?: 'woff2' | 'woff' | 'truetype'
  /** Raw font bytes, or an already-built `data:` URI string passed through verbatim. */
  data: ArrayBuffer | Uint8Array | string
}

/** Turns glyphs into vector outlines so the SVG needs no font at all. */
export interface GlyphPathProvider {
  /**
   * Returns SVG path data (`d`) for `char` at `fontSize`, positioned so the glyph is
   * centered on the origin — advance-width centered horizontally, ink-box centered
   * vertically, matching how the raster renderer centers glyphs in their cell.
   * Return null for glyphs the font can't outline; those fall back to `<text>`.
   */
  getGlyphPath(char: string, fontSize: number): string | null
}

export interface RenderTemplateSVGOptions extends RenderTemplateOptions {
  /**
   * When set, an inline `<style>@font-face{...}</style>` with a base64 data URI is emitted
   * so the SVG renders correctly outside the app. `family` should match the resolved
   * render font, or viewers will fall back to whatever font they have.
   */
  embeddedFont?: EmbeddedFont
  /**
   * When set, glyphs are emitted as vector outlines — each distinct glyph once as a
   * `<defs>` path, placed per cell with `<use>` — instead of `<text>` elements, and no
   * font is needed to view the file. Takes precedence over `embeddedFont`, which is
   * then only used for `<text>` fallbacks of glyphs the provider can't outline.
   */
  glyphPaths?: GlyphPathProvider
}

const XML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
}

function escapeXML(s: string): string {
  return s.replace(/[&<>"']/g, (c) => XML_ESCAPES[c])
}

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

// Runs in both Node (tests) and browsers, so no Buffer and no btoa.
function base64Encode(bytes: Uint8Array): string {
  let out = ''
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i]
    const b1 = bytes[i + 1]
    const b2 = bytes[i + 2]
    out += BASE64_CHARS[b0 >> 2]
    out += BASE64_CHARS[((b0 & 3) << 4) | (b1 === undefined ? 0 : b1 >> 4)]
    out += b1 === undefined ? '=' : BASE64_CHARS[((b1 & 15) << 2) | (b2 === undefined ? 0 : b2 >> 6)]
    out += b2 === undefined ? '=' : BASE64_CHARS[b2 & 63]
  }
  return out
}

const FONT_MIMES = { woff2: 'font/woff2', woff: 'font/woff', truetype: 'font/ttf' } as const

function fontDataUri(font: EmbeddedFont): string {
  if (typeof font.data === 'string') return font.data
  const bytes = font.data instanceof Uint8Array ? font.data : new Uint8Array(font.data)
  return `data:${FONT_MIMES[font.format ?? 'woff2']};base64,${base64Encode(bytes)}`
}

/**
 * Renders `imageData` through `template` to a standalone SVG string — the vector
 * counterpart of `renderTemplateToContext`, sampling the same pixel per
 * `resolution`-sized cell and resolving the font the same way.
 *
 * Glyphs are centered per cell with `text-anchor="middle"` / `dominant-baseline="central"`
 * rather than canvas ink-box metrics, so no DOM or canvas is needed to generate the SVG.
 */
export function renderTemplateToSVG(
  imageData: ImageData,
  template: Template,
  { resolution, scale = 1, font, embeddedFont, glyphPaths }: RenderTemplateSVGOptions
): string {
  const { width, height, data } = imageData
  const outW = width * scale
  const outH = height * scale

  const fontScale = template.meta?.fontScale ?? 1
  const fontWeight = font?.weight ?? template.meta?.fontWeight ?? DEFAULT_FONT.weight
  const fontFamily = font?.family ?? template.meta?.fontFamily ?? DEFAULT_FONT.family
  const fontSize = resolution * scale * fontScale

  interface Cell {
    x: number
    y: number
    pixel: Pixel
  }
  const cells: Cell[] = []
  const backgroundCounts = new Map<string, number>()
  for (let y = 0; y < height; y += resolution) {
    for (let x = 0; x < width; x += resolution) {
      const idx = (y * width + x) * 4
      const pixel = template(data[idx], data[idx + 1], data[idx + 2])
      cells.push({ x, y, pixel })
      backgroundCounts.set(pixel.background, (backgroundCounts.get(pixel.background) ?? 0) + 1)
    }
  }

  // The most common cell background becomes one full-size base rect, and only
  // cells that differ get their own — a large file-size win on the fixed-background
  // templates, where it collapses every per-cell rect into a single element.
  let baseBackground: string | undefined
  let baseCount = 0
  for (const [background, count] of backgroundCounts) {
    if (count > baseCount) {
      baseBackground = background
      baseCount = count
    }
  }

  const parts: string[] = []
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${outW}" height="${outH}" viewBox="0 0 ${outW} ${outH}">`
  )
  if (embeddedFont) {
    parts.push(
      `<style>@font-face{font-family:"${escapeXML(embeddedFont.family)}";` +
        `font-weight:${embeddedFont.weight ?? 400};` +
        `src:url(${fontDataUri(embeddedFont)}) format("${embeddedFont.format ?? 'woff2'}")}</style>`
    )
  }
  if (baseBackground !== undefined) {
    parts.push(`<rect width="${outW}" height="${outH}" fill="${escapeXML(baseBackground)}"/>`)
  }

  const cellW = resolution * scale
  for (const { x, y, pixel } of cells) {
    if (pixel.background !== baseBackground) {
      parts.push(
        `<rect x="${x * scale}" y="${y * scale}" width="${cellW}" height="${cellW}" fill="${escapeXML(pixel.background)}"/>`
      )
    }
  }

  // Each distinct glyph is outlined once in <defs> and stamped per cell with <use>;
  // glyphs the provider can't outline (and everything, when no provider) use <text>.
  const defs: string[] = []
  const glyphIds = new Map<string, string | null>()
  const uses: string[] = []
  const texts: string[] = []
  for (const { x, y, pixel } of cells) {
    if (pixel.char.trim() === '' || pixel.color === 'transparent') continue
    const cx = x * scale + cellW / 2
    const cy = y * scale + cellW / 2

    let glyphId: string | null = null
    if (glyphPaths) {
      const known = glyphIds.get(pixel.char)
      if (known !== undefined) {
        glyphId = known
      } else {
        const d = glyphPaths.getGlyphPath(pixel.char, fontSize)
        glyphId = d === null ? null : `glyph${glyphIds.size}`
        glyphIds.set(pixel.char, glyphId)
        if (d !== null) defs.push(`<path id="${glyphId}" d="${escapeXML(d)}"/>`)
      }
    }

    if (glyphId !== null) {
      uses.push(`<use href="#${glyphId}" x="${cx}" y="${cy}" fill="${escapeXML(pixel.color)}"/>`)
    } else {
      texts.push(`<text x="${cx}" y="${cy}" fill="${escapeXML(pixel.color)}">${escapeXML(pixel.char)}</text>`)
    }
  }

  if (defs.length > 0) parts.push(`<defs>${defs.join('')}</defs>`, ...uses)
  if (texts.length > 0) {
    parts.push(
      `<g font-family="${escapeXML(fontFamily)}" font-size="${fontSize}" font-weight="${fontWeight}" text-anchor="middle" dominant-baseline="central">`,
      ...texts,
      '</g>'
    )
  }
  parts.push('</svg>')
  return parts.join('')
}
