import type { CanvasContext2D, Template } from './types.js'

export interface RenderTemplateOptions {
  resolution: number
  /** Output scale relative to `imageData`'s size. `ctx`'s canvas must already be sized to width*scale x height*scale. */
  scale?: number
}

/**
 * Draws `imageData` through `template` onto `ctx`, one glyph per `resolution`-sized cell.
 * Shared by the ffmpeg pipeline (per-frame, offscreen) and any live preview a consumer builds
 * (same loop, same math — only the target canvas/context differs).
 */
export function renderTemplateToContext(
  imageData: ImageData,
  template: Template,
  { resolution, scale = 1 }: RenderTemplateOptions,
  ctx: CanvasContext2D
): void {
  const { width, height, data } = imageData
  const scaleX = scale
  const scaleY = scale

  const fontScale = template.meta?.fontScale ?? 1
  const fontWeight = template.meta?.fontWeight ?? 400
  const fontFamily = template.meta?.fontFamily ?? 'monospace'
  ctx.font = `${fontWeight} ${resolution * scale * fontScale}px ${fontFamily}`

  for (let y = 0; y < height; y += resolution) {
    for (let x = 0; x < width; x += resolution) {
      const idx = (y * width + x) * 4
      const pixel = template(data[idx], data[idx + 1], data[idx + 2])

      const cellX = x * scaleX
      const cellY = y * scaleY
      const cellW = resolution * scaleX
      const cellH = resolution * scaleY

      ctx.fillStyle = pixel.background
      ctx.fillRect(cellX, cellY, cellW, cellH)

      ctx.fillStyle = pixel.color
      const metrics = ctx.measureText(pixel.char)
      const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
      const textX = cellX + (cellW - metrics.width) / 2
      const textY = cellY + (cellH + textHeight) / 2 - metrics.actualBoundingBoxDescent
      ctx.fillText(pixel.char, textX, textY)
    }
  }
}
