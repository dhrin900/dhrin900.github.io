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
  <defs><radialGradient id="w" cx="38%" cy="32%">
    <stop offset="0" stop-color="#8A6428"/><stop offset="1" stop-color="#5A3F16"/>
  </radialGradient></defs>
  <rect width="64" height="64" rx="14" fill="#F7F3EC"/>
  <circle cx="32" cy="32" r="21" fill="url(#w)"/>
  <circle cx="32" cy="32" r="21" fill="none" stroke="#D9BE8C" stroke-width="1.2" opacity=".65"/>
  <path d="M32 20c-4.4 0-8 3.5-8 7.9 0 2.9 1.6 5.5 4 6.8v6.1h8v-6.1c2.4-1.3 4-3.9 4-6.8 0-4.4-3.6-7.9-8-7.9z" fill="#F7F3EC" opacity=".92"/>
</svg>`;
await writeFile(path.join(A, 'img', 'favicon.svg'), favSvg);
for (const s of [32, 180, 512]) {
  await sharp(Buffer.from(favSvg)).resize(s, s).png().toBuffer()
    .then((b) => writeFile(path.join(A, 'img', `favicon-${s}.png`), b));
}
console.log('favicon  favicon.svg + favicon-32/180/512.png');

/* ---- 4. OG image 1200x630 — hero photo, letterboxed, brass hairline.
        No text baked in, so it stays correct once her name is known. */
const hero = path.join(A, 'img', 'hero-1315.webp');
const OW = 1200, OH = 630;
const inner = await sharp(hero).resize(OW, OH, { fit: 'cover', position: 'right' }).toBuffer();
const og = await sharp({ create: { width: OW, height: OH, channels: 3, background: '#F7F3EC' } })
  .composite([{ input: inner, left: 0, top: 0 }])
  .composite([{
    input: Buffer.from(`<svg width="${OW}" height="${OH}" xmlns="http://www.w3.org/2000/svg">
      <rect x="26" y="26" width="${OW - 52}" height="${OH - 52}" fill="none"
            stroke="#B8863B" stroke-width="1.5" opacity=".55"/>
    </svg>`),
    left: 0, top: 0,
  }])
  .jpeg({ quality: 88, progressive: true }).toBuffer();
await writeFile(path.join(A, 'img', 'og.jpg'), og);
console.log(`og image  og.jpg 1200x630  ${(og.length / 1024).toFixed(0)} KB`);
