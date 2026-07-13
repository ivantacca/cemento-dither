import { FFmpeg } from '@ffmpeg/ffmpeg'

export interface LoadFFmpegConfig {
  coreURL: string
  wasmURL: string
}

/**
 * Optional convenience loader for consumers that don't already manage an FFmpeg instance.
 * Unlike the app this was extracted from, it takes explicit asset URLs instead of assuming
 * `window.location.origin` — the caller decides where its core/wasm assets are served from.
 * Consumers that already load their own FFmpeg (e.g. an app-wide singleton) should keep doing
 * so and pass that instance into `processVideo` instead of calling this.
 */
export async function loadFFmpeg({ coreURL, wasmURL }: LoadFFmpegConfig): Promise<FFmpeg> {
  const ffmpeg = new FFmpeg()
  await ffmpeg.load({ coreURL, wasmURL })
  return ffmpeg
}
