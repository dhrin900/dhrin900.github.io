// P0 / step 3e — per-video rotation classification.
// Left  = frame from the ORIGINAL untouched file (no rotation)
// Right = frame from the current encode (transpose=2 applied once)
// Deciding visually which column is upright tells us the correct rotation map.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const run = promisify(execFile);
const FFMPEG = 'C:/Users/Admin/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe';
const FFPROBE = FFMPEG.replace('ffmpeg.exe', 'ffprobe.exe');
const ROOT = path.resolve('..');
const TMP = path.join(ROOT, 'tools', 'build','classify');
await mkdir(TMP, { recursive: true });

const MAP = {
  'message-main': 'WhatsApp Video 2026-10-02 at 11.53.11.mp4',
  'clip-1': 'WhatsApp Video 2026-10-02 at 12.18.47.mp4',
  'clip-2': 'WhatsApp Video 2026-10-02 at 12.18.48.mp4',
  'clip-3': 'WhatsApp Video 2026-10-02 at 12.19.50.mp4',
  'clip-4': 'WhatsApp Video 2026-10-02 at 12.19.52.mp4',
  'clip-5': 'WhatsApp Video 2026-10-02 at 12.19.55.mp4',
  'clip-long': 'WhatsApp Video 2026-10-02 at 12.19.56.mp4',
  'clip-6': 'WhatsApp Video 2026-10-02 at 12.19.58.mp4',
  'clip-7': 'WhatsApp Video 2026-10-02 at 12.20.00.mp4',
};
const SRC_DIRS = [ROOT, path.join(ROOT, 'pictures and video')];
const AT = { 'message-main': 0.42, 'clip-1': 0.55, 'clip-2': 0.60, 'clip-3': 0.50,
             'clip-4': 0.50, 'clip-5': 0.50, 'clip-long': 0.30, 'clip-6': 0.75, 'clip-7': 0.35 };

async function findOriginal(file) {
  for (const d of SRC_DIRS) { const p = path.join(d, file); try { await stat(p); return p; } catch {} }
  return null;
}

const CW = 300, CH = 340, comp = [];
for (const [name, file] of Object.entries(MAP)) {
  const orig = await findOriginal(file);
  const cur = path.join(ROOT,'assets', 'video', `${name}.mp4`);
  const { stdout } = await run(FFPROBE, ['-v', 'quiet', '-print_format', 'json', '-show_format', cur]);
  const dur = parseFloat(JSON.parse(stdout).format.duration);
  const at = (dur * AT[name]).toFixed(2);

  const grab = async (src, tag) => {
    const o = path.join(TMP, `${name}-${tag}.png`);
    await run(FFMPEG, ['-y', '-v', 'error', '-ss', at, '-i', src, '-frames:v', '1',
      '-vf', 'scale=280:-2', o], { maxBuffer: 1 << 28 });
    return sharp(o).resize(CW - 10, CH - 10, { fit: 'contain', background: '#1a1a1a' }).toBuffer();
  };

  comp.push({ input: await grab(orig, 'orig'), left: 5, top: 0 });
  comp.push({ input: await grab(cur, 'cur'), left: CW + 5, top: 0 });
  console.log(`${name.padEnd(13)} at ${at}s`);
}

const ROWS = Object.keys(MAP).length;
await sharp({ create: { width: CW * 2 + 20, height: ROWS * CH, channels: 3, background: '#00aa00' } })
  .composite(comp.map((c, i) => ({ ...c, top: Math.floor(i / 2) * CH + 5 })))
  .png().toFile(path.join(ROOT, 'tools', 'build','video-classify.png'));
console.log('\n-> tools/build/video-classify.png');
console.log('each row: LEFT = original (unrotated) | RIGHT = current (rot 90 CCW)');
console.log('rows: ' + Object.keys(MAP).join(', '));
