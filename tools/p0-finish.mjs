// P0 / step 4 — finish: message-main UI crop, audio, favicon, OG image
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { stat, writeFile, readFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const run = promisify(execFile);
const FFMPEG = 'C:/Users/Admin/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe';
const FFPROBE = FFMPEG.replace('ffmpeg.exe', 'ffprobe.exe');
const ROOT = path.resolve('..');
const A = path.join(ROOT, '2026', 'assets');

/* ---- 1. message-main: crop the beauty-app filter-picker strip off the right */
const SRC = path.join(ROOT, 'pictures and video', 'WhatsApp Video 2026-10-02 at 11.53.11.mp4');
if (!fs_exists(SRC)) { /* fall back to repo root */ }
function fs_exists(p) { return stat(p).then(() => true, () => false); }

const realSrc = await fs_exists(SRC) ? SRC : path.join(ROOT, 'WhatsApp Video 2026-10-02 at 11.53.11.mp4');
const tmp = path.join(A, 'video', 'mm.tmp.mp4');
await run(FFMPEG, ['-y', '-v', 'error', '-i', realSrc,
  '-vf', "transpose=2,crop=iw*0.895:ih,scale='min(720,iw)':-2",
  '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.0', '-preset', 'slow',
  '-crf', '28', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k',
  '-movflags', '+faststart', tmp], { maxBuffer: 1 << 28 });
await writeFile(path.join(A, 'video', 'message-main.mp4'), await readFile(tmp));
await unlink(tmp);
const mmKB = (await stat(path.join(A, 'video', 'message-main.mp4'))).size / 1024;

const jpg = path.join(A, 'video', 'mm.jpg');
await run(FFMPEG, ['-y', '-v', 'error', '-ss', '12.1', '-i', path.join(A, 'video', 'message-main.mp4'),
  '-frames:v', '1', '-vf', "scale='min(1000,iw)':-2", '-q:v', '3', jpg], { maxBuffer: 1 << 28 });
await writeFile(path.join(A, 'video', 'message-main.webp'), await sharp(jpg).webp({ quality: 80 }).toBuffer());
await sharp(jpg).resize({ width: 640 }).webp({ quality: 78 }).toBuffer()
  .then((b) => writeFile(path.join(A, 'video', 'message-main-640.webp'), b));
await unlink(jpg);
const mmPoster = await sharp(path.join(A, 'video', 'message-main.webp')).metadata();
console.log(`message-main  re-encoded + UI strip cropped  ${mmKB.toFixed(0)} KB  poster ${mmPoster.width}x${mmPoster.height}`);

/* ---- 2. audio: hbd.mpeg -> hbd.m4a (AAC), keeps autoplay working everywhere */
const m4a = path.join(A, 'audio', 'hbd.m4a');
await run(FFMPEG, ['-y', '-v', 'error', '-i', path.join(ROOT, 'music', 'hbd.mpeg'),
  '-c:a', 'aac', '-b:a', '96k', '-ac', '2', '-movflags', '+faststart', m4a], { maxBuffer: 1 << 28 });
const srcMB = (await stat(path.join(ROOT, 'music', 'hbd.mpeg'))).size / 1024;
const outKB = (await stat(m4a)).size / 1024;
const { stdout: ad } = await run(FFPROBE, ['-v', 'quiet', '-print_format', 'json', '-show_format', m4a]);
console.log(`audio  hbd.mpeg ${srcMB.toFixed(0)} KB -> hbd.m4a ${outKB.toFixed(0)} KB  (${parseFloat(JSON.parse(ad).format.duration).toFixed(0)}s, ${(100 * (1 - outKB / srcMB)).toFixed(0)}% smaller)`);

/* ---- 3. favicon: wax-seal motif (the opening concept) in SVG + PNG */
const favSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><radialGradient id="w" cx="38%" cy="30%">
    <stop offset="0" stop-color="#EF8FB4"/><stop offset=".58" stop-color="#C9557F"/><stop offset="1" stop-color="#8C3A61"/>
  </radialGradient></defs>
  <rect width="64" height="64" rx="16" fill="#FFF7F9"/>
  <circle cx="32" cy="32" r="21" fill="url(#w)"/>
  <circle cx="32" cy="32" r="21" fill="none" stroke="#F3D9B1" stroke-width="1.2" opacity=".7"/>
  <path d="M32 44s-12-7.4-12-14.6a7 7 0 0 1 12-4.7 7 7 0 0 1 12 4.7C44 36.6 32 44 32 44z" fill="#FFF7F9" opacity=".95"/>
</svg>`;
await writeFile(path.join(A, 'img', 'favicon.svg'), favSvg);
for (const s of [32, 180, 512]) {
  await sharp(Buffer.from(favSvg)).resize(s, s).png().toBuffer()
    .then((b) => writeFile(path.join(A, 'img', `favicon-${s}.png`), b));
}
console.log('favicon  favicon.svg + favicon-32/180/512.png');

/* ---- 4. OG image 1200x630 — hero photo, letterboxed, rose-gold hairline.
        No text baked in, so it stays correct once her name is known. */
const hero = path.join(A, 'img', 'hero-1315.webp');
const OW = 1200, OH = 630;
const inner = await sharp(hero).resize(OW, OH, { fit: 'cover', position: 'right' }).toBuffer();
const og = await sharp({ create: { width: OW, height: OH, channels: 3, background: '#FFF7F9' } })
  .composite([{ input: inner, left: 0, top: 0 }])
  .composite([{
    input: Buffer.from(`<svg width="${OW}" height="${OH}" xmlns="http://www.w3.org/2000/svg">
      <rect x="26" y="26" width="${OW - 52}" height="${OH - 52}" fill="none"
            stroke="#B76E79" stroke-width="1.5" opacity=".6"/>
    </svg>`),
    left: 0, top: 0,
  }])
  .jpeg({ quality: 88, progressive: true }).toBuffer();
await writeFile(path.join(A, 'img', 'og.jpg'), og);
console.log(`og image  og.jpg 1200x630  ${(og.length / 1024).toFixed(0)} KB`);
