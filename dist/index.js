// src/templates/ascii.ts
var ramp = [
  { char: " ", color: "white", background: "black" },
  { char: ";", color: "white", background: "black" },
  { char: "+", color: "white", background: "black" },
  { char: "*", color: "white", background: "black" },
  { char: "?", color: "white", background: "black" },
  { char: "%", color: "white", background: "black" },
  { char: "S", color: "white", background: "black" },
  { char: "#", color: "white", background: "black" },
  { char: "@", color: "white", background: "black" }
];
var ascii = (r, g, b) => {
  const brightness = (r + g + b) / 3;
  return ramp[Math.floor(brightness / 255 * (ramp.length - 1))];
};
var ascii_default = ascii;

// src/templates/analog.ts
var ramp2 = [
  { char: " ", color: "#A5A8A2", background: "#000000" },
  { char: " ", color: "#A5A8A2", background: "#000000" },
  { char: " ", color: "#A5A8A2", background: "#000000" },
  { char: "*", color: "#EAEC0D", background: "#000DFF" },
  { char: "E", color: "#EAEC0D", background: "#000DFF" },
  { char: "E", color: "#FFFFFF", background: "#000DFF" },
  { char: "E", color: "#FFFFFF", background: "#000DFF" },
  { char: "E", color: "#FFFFFF", background: "#000DFF" },
  { char: "C", color: "#000000", background: "#FF1800" },
  { char: "0", color: "#000000", background: "#FF1800" },
  { char: "3", color: "#FFFFFF", background: "#FF1800" },
  { char: "E", color: "#FFFFFF", background: "#FF1800" },
  { char: "C", color: "#000000", background: "#FFFFFF" },
  { char: "E", color: "#000000", background: "#FFFFFF" },
  { char: "M", color: "#000000", background: "#FFFFFF" },
  { char: "O", color: "#000000", background: "#FFFFFF" },
  { char: "T", color: "#000000", background: "#FFFFFF" },
  { char: "N", color: "#000000", background: "#FFFFFF" },
  { char: "M", color: "#000000", background: "#FFFFFF" },
  { char: "M", color: "#000000", background: "#FFFFFF" }
];
var analog = (r, g, b) => {
  const brightness = (r + g + b) / 3;
  return ramp2[Math.floor(brightness / 255 * (ramp2.length - 1))];
};
var analog_default = analog;

// src/templates/sorted.ts
var ramp3 = [
  { char: " ", color: "#000000", background: "#000000" },
  { char: "f", color: "#000000", background: "#000000" },
  { char: "0", color: "#000000", background: "#000000" },
  { char: "W", color: "#000000", background: "#000000" },
  { char: ".", color: "#000000", background: "#111111" },
  { char: "j", color: "#000000", background: "#111111" },
  { char: "O", color: "#000000", background: "#111111" },
  { char: "&", color: "#000000", background: "#111111" },
  { char: ",", color: "#000000", background: "#222222" },
  { char: "r", color: "#000000", background: "#222222" },
  { char: "Z", color: "#000000", background: "#222222" },
  { char: "8", color: "#000000", background: "#222222" },
  { char: ":", color: "#000000", background: "#333333" },
  { char: "x", color: "#000000", background: "#333333" },
  { char: "m", color: "#000000", background: "#333333" },
  { char: "%", color: "#000000", background: "#333333" },
  { char: ";", color: "#000000", background: "#444444" },
  { char: "n", color: "#000000", background: "#444444" },
  { char: "w", color: "#000000", background: "#444444" },
  { char: "B", color: "#000000", background: "#444444" },
  { char: "i", color: "#000000", background: "#555555" },
  { char: "u", color: "#000000", background: "#555555" },
  { char: "q", color: "#000000", background: "#555555" },
  { char: "@", color: "#000000", background: "#555555" },
  { char: "l", color: "#000000", background: "#666666" },
  { char: "v", color: "#000000", background: "#666666" },
  { char: "p", color: "#000000", background: "#666666" },
  { char: "$", color: "#000000", background: "#666666" },
  { char: "!", color: "#000000", background: "#777777" },
  { char: "c", color: "#000000", background: "#777777" },
  { char: "d", color: "#000000", background: "#777777" },
  { char: "Q", color: "#000000", background: "#777777" },
  { char: "I", color: "#000000", background: "#888888" },
  { char: "z", color: "#000000", background: "#888888" },
  { char: "b", color: "#000000", background: "#888888" },
  { char: "G", color: "#000000", background: "#888888" },
  { char: "|", color: "#000000", background: "#999999" },
  { char: "X", color: "#000000", background: "#999999" },
  { char: "k", color: "#000000", background: "#999999" },
  { char: "R", color: "#000000", background: "#999999" },
  { char: "/", color: "#000000", background: "#AAAAAA" },
  { char: "Y", color: "#000000", background: "#AAAAAA" },
  { char: "h", color: "#000000", background: "#AAAAAA" },
  { char: "S", color: "#000000", background: "#AAAAAA" },
  { char: "/", color: "#000000", background: "#BBBBBB" },
  { char: "U", color: "#000000", background: "#BBBBBB" },
  { char: "a", color: "#000000", background: "#BBBBBB" },
  { char: "A", color: "#000000", background: "#BBBBBB" },
  { char: "(", color: "#000000", background: "#CCCCCC" },
  { char: "J", color: "#000000", background: "#CCCCCC" },
  { char: "o", color: "#000000", background: "#CCCCCC" },
  { char: "E", color: "#000000", background: "#CCCCCC" },
  { char: ")", color: "#000000", background: "#DDDDDD" },
  { char: "C", color: "#000000", background: "#DDDDDD" },
  { char: "*", color: "#000000", background: "#DDDDDD" },
  { char: "F", color: "#000000", background: "#DDDDDD" },
  { char: "1", color: "#000000", background: "#EEEEEE" },
  { char: "L", color: "#000000", background: "#EEEEEE" },
  { char: "#", color: "#000000", background: "#EEEEEE" },
  { char: "H", color: "#000000", background: "#EEEEEE" },
  { char: "t", color: "#000000", background: "#FFFFFF" },
  { char: "Q", color: "#000000", background: "#FFFFFF" },
  { char: "M", color: "#000000", background: "#FFFFFF" },
  { char: "T", color: "#000000", background: "#FFFFFF" }
];
var sorted = (r, g, b) => {
  const brightness = (r + g + b) / 3;
  return ramp3[Math.floor(brightness / 255 * (ramp3.length - 1))];
};
var sorted_default = sorted;

// src/templates/lowres.ts
var lowres = (r, g, b) => ({
  char: " ",
  color: "transparent",
  background: `rgb(${r},${g},${b})`
});
var lowres_default = lowres;

// src/templates/lowresInvertedAscii.ts
var chars = [" ", "f", "0", "W", ".", "j", "O", "&", ",", "r", "Z", "8", ":", "x", "m", "%", ";", "n", "w", "B", "i", "u", "q", "@", "l", "v", "p", "$", "!", "c", "d", "Q", "I", "z", "b", "G", "|", "X", "k", "R", "/", "Y", "h", "S", "/", "U", "a", "A", "(", "J", "o", "E", ")", "C", "*", "F", "1", "L", "#", "H", "t", "Q", "M", "T"];
var lowresInvertedAscii = (r, g, b) => {
  const brightness = (r + g + b) / 3;
  const char = chars[Math.floor(brightness / 255 * (chars.length - 1))];
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  const color = luminance > 128 ? "black" : "white";
  return { char, color, background: `rgb(${r},${g},${b})` };
};
var lowresInvertedAscii_default = lowresInvertedAscii;

// src/templates/index.ts
var templates = {
  ascii: ascii_default,
  analog: analog_default,
  sorted: sorted_default,
  lowres: lowres_default,
  lowresInvertedAscii: lowresInvertedAscii_default
};
var TEMPLATE_NAMES = Object.keys(templates);

// src/renderFrame.ts
var DEFAULT_FONT = { family: "Space Mono", weight: 400 };
function renderTemplateToContext(imageData, template, { resolution, scale = 1, font }, ctx) {
  const { width, height, data } = imageData;
  const scaleX = scale;
  const scaleY = scale;
  const fontScale = template.meta?.fontScale ?? 1;
  const fontWeight = font?.weight ?? template.meta?.fontWeight ?? DEFAULT_FONT.weight;
  const fontFamily = font?.family ?? template.meta?.fontFamily ?? DEFAULT_FONT.family;
  ctx.font = `${fontWeight} ${resolution * scale * fontScale}px "${fontFamily}"`;
  for (let y = 0; y < height; y += resolution) {
    for (let x = 0; x < width; x += resolution) {
      const idx = (y * width + x) * 4;
      const pixel = template(data[idx], data[idx + 1], data[idx + 2]);
      const cellX = x * scaleX;
      const cellY = y * scaleY;
      const cellW = resolution * scaleX;
      const cellH = resolution * scaleY;
      ctx.fillStyle = pixel.background;
      ctx.fillRect(cellX, cellY, cellW, cellH);
      ctx.fillStyle = pixel.color;
      const metrics = ctx.measureText(pixel.char);
      const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      const textX = cellX + (cellW - metrics.width) / 2;
      const textY = cellY + (cellH + textHeight) / 2 - metrics.actualBoundingBoxDescent;
      ctx.fillText(pixel.char, textX, textY);
    }
  }
}

// src/renderSVG.ts
var XML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;"
};
function escapeXML(s) {
  return s.replace(/[&<>"']/g, (c) => XML_ESCAPES[c]);
}
var BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function base64Encode(bytes) {
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = bytes[i + 1];
    const b2 = bytes[i + 2];
    out += BASE64_CHARS[b0 >> 2];
    out += BASE64_CHARS[(b0 & 3) << 4 | (b1 === void 0 ? 0 : b1 >> 4)];
    out += b1 === void 0 ? "=" : BASE64_CHARS[(b1 & 15) << 2 | (b2 === void 0 ? 0 : b2 >> 6)];
    out += b2 === void 0 ? "=" : BASE64_CHARS[b2 & 63];
  }
  return out;
}
var FONT_MIMES = { woff2: "font/woff2", woff: "font/woff", truetype: "font/ttf" };
function fontDataUri(font) {
  if (typeof font.data === "string") return font.data;
  const bytes = font.data instanceof Uint8Array ? font.data : new Uint8Array(font.data);
  return `data:${FONT_MIMES[font.format ?? "woff2"]};base64,${base64Encode(bytes)}`;
}
function renderTemplateToSVG(imageData, template, { resolution, scale = 1, font, embeddedFont, glyphPaths }) {
  const { width, height, data } = imageData;
  const outW = width * scale;
  const outH = height * scale;
  const fontScale = template.meta?.fontScale ?? 1;
  const fontWeight = font?.weight ?? template.meta?.fontWeight ?? DEFAULT_FONT.weight;
  const fontFamily = font?.family ?? template.meta?.fontFamily ?? DEFAULT_FONT.family;
  const fontSize = resolution * scale * fontScale;
  const cells = [];
  const backgroundCounts = /* @__PURE__ */ new Map();
  for (let y = 0; y < height; y += resolution) {
    for (let x = 0; x < width; x += resolution) {
      const idx = (y * width + x) * 4;
      const pixel = template(data[idx], data[idx + 1], data[idx + 2]);
      cells.push({ x, y, pixel });
      backgroundCounts.set(pixel.background, (backgroundCounts.get(pixel.background) ?? 0) + 1);
    }
  }
  let baseBackground;
  let baseCount = 0;
  for (const [background, count] of backgroundCounts) {
    if (count > baseCount) {
      baseBackground = background;
      baseCount = count;
    }
  }
  const parts = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${outW}" height="${outH}" viewBox="0 0 ${outW} ${outH}">`
  );
  if (embeddedFont) {
    parts.push(
      `<style>@font-face{font-family:"${escapeXML(embeddedFont.family)}";font-weight:${embeddedFont.weight ?? 400};src:url(${fontDataUri(embeddedFont)}) format("${embeddedFont.format ?? "woff2"}")}</style>`
    );
  }
  if (baseBackground !== void 0) {
    parts.push(`<rect width="${outW}" height="${outH}" fill="${escapeXML(baseBackground)}"/>`);
  }
  const cellW = resolution * scale;
  for (const { x, y, pixel } of cells) {
    if (pixel.background !== baseBackground) {
      parts.push(
        `<rect x="${x * scale}" y="${y * scale}" width="${cellW}" height="${cellW}" fill="${escapeXML(pixel.background)}"/>`
      );
    }
  }
  const defs = [];
  const glyphIds = /* @__PURE__ */ new Map();
  const uses = [];
  const texts = [];
  for (const { x, y, pixel } of cells) {
    if (pixel.char.trim() === "" || pixel.color === "transparent") continue;
    const cx = x * scale + cellW / 2;
    const cy = y * scale + cellW / 2;
    let glyphId = null;
    if (glyphPaths) {
      const known = glyphIds.get(pixel.char);
      if (known !== void 0) {
        glyphId = known;
      } else {
        const d = glyphPaths.getGlyphPath(pixel.char, fontSize);
        glyphId = d === null ? null : `glyph${glyphIds.size}`;
        glyphIds.set(pixel.char, glyphId);
        if (d !== null) defs.push(`<path id="${glyphId}" d="${escapeXML(d)}"/>`);
      }
    }
    if (glyphId !== null) {
      uses.push(`<use href="#${glyphId}" x="${cx}" y="${cy}" fill="${escapeXML(pixel.color)}"/>`);
    } else {
      texts.push(`<text x="${cx}" y="${cy}" fill="${escapeXML(pixel.color)}">${escapeXML(pixel.char)}</text>`);
    }
  }
  if (defs.length > 0) parts.push(`<defs>${defs.join("")}</defs>`, ...uses);
  if (texts.length > 0) {
    parts.push(
      `<g font-family="${escapeXML(fontFamily)}" font-size="${fontSize}" font-weight="${fontWeight}" text-anchor="middle" dominant-baseline="central">`,
      ...texts,
      "</g>"
    );
  }
  parts.push("</svg>");
  return parts.join("");
}

// src/processVideo.ts
import { fetchFile } from "@ffmpeg/util";

// src/font.ts
var readyFonts = /* @__PURE__ */ new Set();
async function ensureFontLoaded(family, weight = 400) {
  const key = `${weight} ${family}`;
  if (readyFonts.has(key)) return;
  if (typeof document === "undefined" || !document.fonts) return;
  await document.fonts.load(`${weight} 16px "${family}"`);
  readyFonts.add(key);
}

// src/processVideo.ts
function getVideoDimensions(file) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      resolve({ width: video.videoWidth, height: video.videoHeight, duration: video.duration });
      URL.revokeObjectURL(video.src);
    };
    video.src = URL.createObjectURL(file);
  });
}
async function renderAsciiFrame(frameData, template, resolution, scale, width, height, font) {
  const blob = new Blob([frameData.buffer], { type: "image/png" });
  const bitmap = await createImageBitmap(blob);
  const srcCanvas = new OffscreenCanvas(width, height);
  const srcCtx = srcCanvas.getContext("2d");
  srcCtx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const imageData = srcCtx.getImageData(0, 0, width, height);
  const outCanvas = new OffscreenCanvas(width * scale, height * scale);
  const ctx = outCanvas.getContext("2d");
  renderTemplateToContext(imageData, template, { resolution, scale, font }, ctx);
  const resultBlob = await outCanvas.convertToBlob({ type: "image/png" });
  return new Uint8Array(await resultBlob.arrayBuffer());
}
async function processVideo({
  ffmpeg,
  file,
  template,
  resolution,
  scale,
  font = DEFAULT_FONT,
  onPhase,
  onProgress
}) {
  const { width, height, duration } = await getVideoDimensions(file);
  await ensureFontLoaded(font.family, font.weight);
  onPhase?.("extracting");
  await ffmpeg.writeFile("input.mp4", await fetchFile(file));
  await ffmpeg.exec(["-i", "input.mp4", "frame_%d.png"]);
  await ffmpeg.deleteFile("input.mp4");
  const entries = await ffmpeg.listDir("/");
  const frameFiles = entries.filter((f) => !f.isDir && /^frame_\d+\.png$/.test(f.name)).sort((a, b) => {
    const na = parseInt(a.name.match(/\d+/)[0]);
    const nb = parseInt(b.name.match(/\d+/)[0]);
    return na - nb;
  });
  const totalFrames = frameFiles.length;
  const fps = Math.max(1, Math.round(totalFrames / duration));
  onPhase?.("processing");
  for (let i = 0; i < frameFiles.length; i++) {
    const frameData = await ffmpeg.readFile(frameFiles[i].name);
    const asciiData = await renderAsciiFrame(frameData, template, resolution, scale, width, height, font);
    await ffmpeg.writeFile(`ascii_${i + 1}.png`, asciiData);
    await ffmpeg.deleteFile(frameFiles[i].name);
    onProgress?.(i + 1, totalFrames);
  }
  onPhase?.("encoding");
  await ffmpeg.exec([
    "-framerate",
    String(fps),
    "-start_number",
    "1",
    "-i",
    "ascii_%d.png",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "output.mp4"
  ]);
  const outputData = await ffmpeg.readFile("output.mp4");
  await ffmpeg.deleteFile("output.mp4");
  for (let i = 1; i <= totalFrames; i++) {
    await ffmpeg.deleteFile(`ascii_${i}.png`);
  }
  return new Blob([outputData.buffer], { type: "video/mp4" });
}

// src/ffmpeg/loadFFmpeg.ts
import { FFmpeg } from "@ffmpeg/ffmpeg";
async function loadFFmpeg({ coreURL, wasmURL }) {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load({ coreURL, wasmURL });
  return ffmpeg;
}
export {
  DEFAULT_FONT,
  TEMPLATE_NAMES,
  analog_default as analog,
  ascii_default as ascii,
  ensureFontLoaded,
  loadFFmpeg,
  lowres_default as lowres,
  lowresInvertedAscii_default as lowresInvertedAscii,
  processVideo,
  renderTemplateToContext,
  renderTemplateToSVG,
  sorted_default as sorted,
  templates
};
//# sourceMappingURL=index.js.map