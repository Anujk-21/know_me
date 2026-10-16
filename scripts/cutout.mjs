import sharp from 'sharp';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

// Where your original screenshots are. Change if they're not in Downloads.
const src = path.join(os.homedir(), 'Downloads');

const jobs = [
  ['lw3_tundra.png', 'lw3-tundra.png'],
  ['statichv.png', 'static-hv.png'],
  ['mg42.png', 'mg42.png'],
];

fs.mkdirSync('public/game', { recursive: true });

for (const [input, output] of jobs) {
  const file = path.join(src, input);
  if (!fs.existsSync(file)) {
    console.log('MISSING:', file);
    continue;
  }
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // near-white -> transparent, with a soft edge
  for (let i = 0; i < data.length; i += 4) {
    const min = Math.min(data[i], data[i + 1], data[i + 2]);
    if (min >= 240) data[i + 3] = 0;
    else if (min >= 215) data[i + 3] = Math.round((255 * (240 - min)) / 25);
  }

  const cut = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  await sharp(cut)
    .trim()
    .resize({ width: 1000, withoutEnlargement: true })
    .png()
    .toFile(path.join('public/game', output));

  console.log('done:', output);
}