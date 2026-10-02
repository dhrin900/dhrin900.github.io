// P0 / step 5 — OG share image 1200x630
// Hero photo, cropped toward the subject, thin brass hairline frame.
// Deliberately contains NO text, so it stays correct once her name is known.
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('..');
const OUT = path.join(ROOT,'assets', 'img', 'og.jpg');
const OW = 1200, OH = 630;

const frame = Buffer.from(
  `<svg width="${OW}" height="${OH}" xmlns="http://www.w3.org/2000/svg">` +
  `<rect x="26" y="26" width="${OW - 52}" height="${OH - 52}" fill="none" ` +
  `stroke="#B8863B" stroke-width="1.5" opacity="0.55"/></svg>`
);

// 'right' anchor keeps her face in frame — the hero subject sits right-of-centre
const photo = await sharp(path.join(ROOT,'assets', 'img', 'hero-1315.webp'))
  .resize(OW, OH, { fit: 'cover', position: 'right' }).toBuffer();

const og = await sharp({ create: { width: OW, height: OH, channels: 3, background: '#F7F3EC' } })
  .composite([{ input: photo, left: 0, top: 0 }, { input: frame, left: 0, top: 0 }])
  .jpeg({ quality: 88, progressive: true })
  .toBuffer();

await writeFile(OUT, og);
console.log(`og.jpg  ${OW}x${OH}  ${(og.length / 1024).toFixed(0)} KB`);
