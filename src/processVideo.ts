import { fetchFile } from '@ffmpeg/util'
import { renderTemplateToContext } from './renderFrame.js'
import type { ProcessVideoOptions, Template } from './types.js'

function getVideoDimensions(file: Blob): Promise<{ width: number; height: number; duration: number }> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      resolve({ width: video.videoWidth, height: video.videoHeight, duration: video.duration })
      URL.revokeObjectURL(video.src)
    }
    video.src = URL.createObjectURL(file)
  })
}

async function renderAsciiFrame(
  frameData: Uint8Array,
  template: Template,
  resolution: number,
  scale: number,
  width: number,
  height: number
): Promise<Uint8Array> {
  const blob = new Blob([frameData.buffer as ArrayBuffer], { type: 'image/png' })
  const bitmap = await createImageBitmap(blob)

  const srcCanvas = new OffscreenCanvas(width, height)
  const srcCtx = srcCanvas.getContext('2d')!
  srcCtx.drawImage(bitmap, 0, 0)
  bitmap.close()
  const imageData = srcCtx.getImageData(0, 0, width, height)

  const outCanvas = new OffscreenCanvas(width * scale, height * scale)
  const ctx = outCanvas.getContext('2d')!
  renderTemplateToContext(imageData, template, { resolution, scale }, ctx)

  const resultBlob = await outCanvas.convertToBlob({ type: 'image/png' })
  return new Uint8Array(await resultBlob.arrayBuffer())
}

/**
 * Runs the full extract -> per-frame render -> re-encode pipeline against a caller-owned,
 * already-loaded FFmpeg instance. This function never creates or loads FFmpeg itself, so a
 * consumer that already has an FFmpeg instance (e.g. a shared app-wide singleton) never ends
 * up with a second one.
 */
export async function processVideo({
  ffmpeg,
  file,
  template,
  resolution,
  scale,
  onPhase,
  onProgress,
}: ProcessVideoOptions): Promise<Blob> {
  const { width, height, duration } = await getVideoDimensions(file)

  onPhase?.('extracting')
  await ffmpeg.writeFile('input.mp4', await fetchFile(file))
  await ffmpeg.exec(['-i', 'input.mp4', 'frame_%d.png'])
  await ffmpeg.deleteFile('input.mp4')

  const entries = await ffmpeg.listDir('/')
  const frameFiles = entries
    .filter((f) => !f.isDir && /^frame_\d+\.png$/.test(f.name))
    .sort((a, b) => {
      const na = parseInt(a.name.match(/\d+/)![0])
      const nb = parseInt(b.name.match(/\d+/)![0])
      return na - nb
    })

  const totalFrames = frameFiles.length
  const fps = Math.max(1, Math.round(totalFrames / duration))

  onPhase?.('processing')
  for (let i = 0; i < frameFiles.length; i++) {
    const frameData = (await ffmpeg.readFile(frameFiles[i].name)) as Uint8Array
    const asciiData = await renderAsciiFrame(frameData, template, resolution, scale, width, height)
    await ffmpeg.writeFile(`ascii_${i + 1}.png`, asciiData)
    await ffmpeg.deleteFile(frameFiles[i].name)
    onProgress?.(i + 1, totalFrames)
  }

  onPhase?.('encoding')
  await ffmpeg.exec([
    '-framerate', String(fps),
    '-start_number', '1',
    '-i', 'ascii_%d.png',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    'output.mp4',
  ])

  const outputData = (await ffmpeg.readFile('output.mp4')) as Uint8Array
  await ffmpeg.deleteFile('output.mp4')
  for (let i = 1; i <= totalFrames; i++) {
    await ffmpeg.deleteFile(`ascii_${i}.png`)
  }

  return new Blob([outputData.buffer as ArrayBuffer], { type: 'video/mp4' })
}
