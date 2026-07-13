import type { FFmpeg } from '@ffmpeg/ffmpeg'

export interface Pixel {
  char: string
  color: string
  background: string
}

export interface TemplateMeta {
  fontScale?: number
  fontWeight?: number
  fontFamily?: string
}

/** A template maps a raw RGB pixel to a glyph + colors. Optional `.meta` tunes font rendering. */
export type Template = ((r: number, g: number, b: number) => Pixel) & { meta?: TemplateMeta }

export type Phase = 'extracting' | 'processing' | 'encoding'

export interface ProcessVideoOptions {
  /** Caller-owned FFmpeg instance — already loaded. This package never creates or loads its own. */
  ffmpeg: FFmpeg
  file: Blob
  template: Template
  resolution: number
  scale: number
  onPhase?: (phase: Phase) => void
  onProgress?: (current: number, total: number) => void
}

export type CanvasContext2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
