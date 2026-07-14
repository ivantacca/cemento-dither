# cemento-dither

Dithering, synthetization and ASCII-art video effects, powered by [ffmpeg-wasm](https://github.com/ffmpegwasm/ffmpeg.wasm).

This package is the shared core extracted from [cemento-dither-app](https://github.com/ivantacca/cemento-dither-app). It contains the per-pixel render "templates" (`ascii`, `analog`, `sorted`, `lowres`, `lowresInvertedAscii`) and the ffmpeg pipeline that applies one of them to every frame of a video, but it does **not** manage ffmpeg-wasm's lifecycle itself.

## Why you bring your own FFmpeg instance

Apps that already use ffmpeg-wasm elsewhere (for trimming, joining, etc.) shouldn't end up with a second ffmpeg-wasm instance/wasm download just to use this package. So `@ffmpeg/ffmpeg` and `@ffmpeg/util` are **peerDependencies**, not dependencies, and every function here takes an already-loaded `FFmpeg` instance as a parameter instead of creating one.

- If your app already has an `FFmpeg` singleton, just pass it in.
- If it doesn't yet, use the optional `loadFFmpeg()` helper exported here.

This package is published as ESM only. From a CommonJS file, load it with a dynamic `import()` (`const { templates } = await import('cemento-dither')`) rather than `require()`.

## Why you bring your own fonts

This package owns font *mechanics* only — accepting a `font` option at render time and letting you wait for it to be ready before drawing. It does **not** know about Google Fonts (or any other catalog): there's no bundled font list and no picker UI here. Loading the actual font (a Google Fonts `<link>`, a self-hosted `@font-face`, or the `FontFace` API) is entirely up to your app; `ensureFontLoaded` just waits for whatever you've already registered.

## Install

```json
{
  "dependencies": {
    "cemento-dither": "github:ivantacca/cemento-dither#main"
  }
}
```

## Usage

```ts
import { processVideo, templates } from 'cemento-dither'

// `ffmpeg` is an FFmpeg instance you already created and loaded.
const outputBlob = await processVideo({
  ffmpeg,
  file: videoFile,           // File | Blob
  template: templates.ascii, // or templates.analog / sorted / lowres / lowresInvertedAscii
  resolution: 10,            // pixel-block size
  scale: 1,                  // output upscale factor
  font: { family: 'JetBrains Mono', weight: 400 }, // optional — defaults to Space Mono 400
  onPhase: (phase) => console.log(phase),         // 'extracting' | 'processing' | 'encoding'
  onProgress: (current, total) => console.log(current, total),
})
```

`processVideo` awaits `ensureFontLoaded` for you internally before rendering any frame, so as long as your app has already added the font's stylesheet/`FontFace` to the page, you don't need to do anything else.

### If you don't have an FFmpeg instance yet

```ts
import { loadFFmpeg, processVideo, templates } from 'cemento-dither'

const ffmpeg = await loadFFmpeg({
  coreURL: '/ffmpeg/ffmpeg-core.js',
  wasmURL: '/ffmpeg/ffmpeg-core.wasm',
})

const outputBlob = await processVideo({ ffmpeg, file, template: templates.ascii, resolution: 10, scale: 1 })
```

### Live/single-frame preview

`renderTemplateToContext` is the same per-pixel render loop `processVideo` uses internally, exposed for building an instant preview (e.g. scrubbing a timeline) without invoking ffmpeg at all. Unlike `processVideo`, it's synchronous and does **not** wait for the font itself — call `ensureFontLoaded` first if you're switching fonts on the fly:

```ts
import { ensureFontLoaded, renderTemplateToContext } from 'cemento-dither'

await ensureFontLoaded('JetBrains Mono', 400)

canvas.width = width * scale
canvas.height = height * scale
renderTemplateToContext(
  imageData,
  templates.ascii,
  { resolution: 10, scale: 1, font: { family: 'JetBrains Mono', weight: 400 } },
  canvas.getContext('2d')
)
```

## API

- `templates: Record<string, Template>` — the 5 built-in templates, keyed by name.
- `TEMPLATE_NAMES: string[]` — `Object.keys(templates)`.
- `processVideo(options: ProcessVideoOptions): Promise<Blob>` — runs extract → per-frame render → re-encode against the given `ffmpeg` instance, waits for `font` to be ready, and returns the output mp4 as a `Blob`.
- `renderTemplateToContext(imageData, template, { resolution, scale, font }, ctx)` — draws one frame through a template onto any 2D canvas context.
- `ensureFontLoaded(family: string, weight?: number): Promise<void>` — waits for a font already registered on the page (via `<link>`, `@font-face`, or `FontFace`) to be ready for Canvas2D. Does not fetch or register fonts itself.
- `loadFFmpeg({ coreURL, wasmURL }): Promise<FFmpeg>` — optional convenience loader.
- `DEFAULT_FONT: RenderFont` — `{ family: 'Space Mono', weight: 400 }`, the fallback used when no `font` option and no template `meta` apply.

A `Template` is `(r: number, g: number, b: number) => { char, color, background }`, optionally with a static `.meta` (`fontScale`, `fontWeight`, `fontFamily`) used as a template-level fallback default when no render-time `font` option is passed — the render-time `font` option always wins when provided.

## Development

```
npm install
npm run build      # tsup -> dist/ (ESM + .d.ts)
npm run typecheck
npm test
```

`dist/` is gitignored and rebuilt automatically by the `prepare` npm lifecycle script, including when this package is installed as a git dependency (`github:ivantacca/cemento-dither#main`) — you never need to hand-edit or commit `dist/index.d.ts`; it's generated from the TypeScript source on every install/build.

## License

MIT
