import { FFmpeg } from '@ffmpeg/ffmpeg';

interface Pixel {
    char: string;
    color: string;
    background: string;
}
interface TemplateMeta {
    fontScale?: number;
    fontWeight?: number;
    fontFamily?: string;
}
/** A template maps a raw RGB pixel to a glyph + colors. Optional `.meta` tunes font rendering. */
type Template = ((r: number, g: number, b: number) => Pixel) & {
    meta?: TemplateMeta;
};
type Phase = 'extracting' | 'processing' | 'encoding';
/** A render-time font choice. `weight` defaults to 400 when omitted. */
interface RenderFont {
    family: string;
    weight?: number;
}
interface ProcessVideoOptions {
    /** Caller-owned FFmpeg instance — already loaded. This package never creates or loads its own. */
    ffmpeg: FFmpeg;
    file: Blob;
    template: Template;
    resolution: number;
    scale: number;
    /** Font to draw glyphs with. Defaults to `{ family: 'Space Mono', weight: 400 }`. */
    font?: RenderFont;
    onPhase?: (phase: Phase) => void;
    onProgress?: (current: number, total: number) => void;
}
type CanvasContext2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

declare const ascii: Template;

declare const analog: Template;

declare const sorted: Template;

declare const lowres: Template;

declare const lowresInvertedAscii: Template;

declare const templates: Record<string, Template>;
declare const TEMPLATE_NAMES: string[];

declare const DEFAULT_FONT: Required<RenderFont>;
interface RenderTemplateOptions {
    resolution: number;
    /** Output scale relative to `imageData`'s size. `ctx`'s canvas must already be sized to width*scale x height*scale. */
    scale?: number;
    /** Font to draw glyphs with. Defaults to `template.meta`'s font, then `{ family: 'Space Mono', weight: 400 }`. */
    font?: RenderFont;
}
/**
 * Draws `imageData` through `template` onto `ctx`, one glyph per `resolution`-sized cell.
 * Shared by the ffmpeg pipeline (per-frame, offscreen) and any live preview a consumer builds
 * (same loop, same math — only the target canvas/context differs).
 *
 * Does not itself wait for the resolved font to finish loading — callers building a live
 * preview should `await ensureFontLoaded(...)` first; `processVideo` does this internally.
 */
declare function renderTemplateToContext(imageData: ImageData, template: Template, { resolution, scale, font }: RenderTemplateOptions, ctx: CanvasContext2D): void;

/** A font to inline into the SVG as a base64 `@font-face`, so it renders standalone. */
interface EmbeddedFont {
    family: string;
    /** Defaults to 400. */
    weight?: number;
    /** Defaults to 'woff2'. */
    format?: 'woff2' | 'woff' | 'truetype';
    /** Raw font bytes, or an already-built `data:` URI string passed through verbatim. */
    data: ArrayBuffer | Uint8Array | string;
}
/** Turns glyphs into vector outlines so the SVG needs no font at all. */
interface GlyphPathProvider {
    /**
     * Returns SVG path data (`d`) for `char` at `fontSize`, positioned so the glyph is
     * centered on the origin — advance-width centered horizontally, ink-box centered
     * vertically, matching how the raster renderer centers glyphs in their cell.
     * Return null for glyphs the font can't outline; those fall back to `<text>`.
     */
    getGlyphPath(char: string, fontSize: number): string | null;
}
interface RenderTemplateSVGOptions extends RenderTemplateOptions {
    /**
     * When set, an inline `<style>@font-face{...}</style>` with a base64 data URI is emitted
     * so the SVG renders correctly outside the app. `family` should match the resolved
     * render font, or viewers will fall back to whatever font they have.
     */
    embeddedFont?: EmbeddedFont;
    /**
     * When set, glyphs are emitted as vector outlines — each distinct glyph once as a
     * `<defs>` path, placed per cell with `<use>` — instead of `<text>` elements, and no
     * font is needed to view the file. Takes precedence over `embeddedFont`, which is
     * then only used for `<text>` fallbacks of glyphs the provider can't outline.
     */
    glyphPaths?: GlyphPathProvider;
}
/**
 * Renders `imageData` through `template` to a standalone SVG string — the vector
 * counterpart of `renderTemplateToContext`, sampling the same pixel per
 * `resolution`-sized cell and resolving the font the same way.
 *
 * Glyphs are centered per cell with `text-anchor="middle"` / `dominant-baseline="central"`
 * rather than canvas ink-box metrics, so no DOM or canvas is needed to generate the SVG.
 */
declare function renderTemplateToSVG(imageData: ImageData, template: Template, { resolution, scale, font, embeddedFont, glyphPaths }: RenderTemplateSVGOptions): string;

/**
 * Runs the full extract -> per-frame render -> re-encode pipeline against a caller-owned,
 * already-loaded FFmpeg instance. This function never creates or loads FFmpeg itself, so a
 * consumer that already has an FFmpeg instance (e.g. a shared app-wide singleton) never ends
 * up with a second one.
 */
declare function processVideo({ ffmpeg, file, template, resolution, scale, font, onPhase, onProgress, }: ProcessVideoOptions): Promise<Blob>;

interface LoadFFmpegConfig {
    coreURL: string;
    wasmURL: string;
}
/**
 * Optional convenience loader for consumers that don't already manage an FFmpeg instance.
 * Unlike the app this was extracted from, it takes explicit asset URLs instead of assuming
 * `window.location.origin` — the caller decides where its core/wasm assets are served from.
 * Consumers that already load their own FFmpeg (e.g. an app-wide singleton) should keep doing
 * so and pass that instance into `processVideo` instead of calling this.
 */
declare function loadFFmpeg({ coreURL, wasmURL }: LoadFFmpegConfig): Promise<FFmpeg>;

/**
 * Waits for `family`/`weight` to be ready for Canvas2D `fillText`, if the browser already
 * knows about it (via a `<link>`, `@font-face`, or `FontFace` the caller registered). This
 * never fetches or registers a font itself — cemento-dither has no Google Fonts catalog of
 * its own; callers own loading the stylesheet/FontFace before calling this.
 */
declare function ensureFontLoaded(family: string, weight?: number): Promise<void>;

export { type CanvasContext2D, DEFAULT_FONT, type EmbeddedFont, type GlyphPathProvider, type LoadFFmpegConfig, type Phase, type Pixel, type ProcessVideoOptions, type RenderFont, type RenderTemplateOptions, type RenderTemplateSVGOptions, TEMPLATE_NAMES, type Template, type TemplateMeta, analog, ascii, ensureFontLoaded, loadFFmpeg, lowres, lowresInvertedAscii, processVideo, renderTemplateToContext, renderTemplateToSVG, sorted, templates };
