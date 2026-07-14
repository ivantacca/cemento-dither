import type { RenderFont } from './types.js'

const readyFonts = new Set<string>()

/**
 * Waits for `family`/`weight` to be ready for Canvas2D `fillText`, if the browser already
 * knows about it (via a `<link>`, `@font-face`, or `FontFace` the caller registered). This
 * never fetches or registers a font itself — cemento-dither has no Google Fonts catalog of
 * its own; callers own loading the stylesheet/FontFace before calling this.
 */
export async function ensureFontLoaded(family: string, weight = 400): Promise<void> {
  const key = `${weight} ${family}`
  if (readyFonts.has(key)) return
  if (typeof document === 'undefined' || !document.fonts) return

  await document.fonts.load(`${weight} 16px "${family}"`)
  readyFonts.add(key)
}

export type { RenderFont }
