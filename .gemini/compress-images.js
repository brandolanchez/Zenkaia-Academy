const sharp = require('sharp');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'public', 'images', 'images');

async function convert() {
  const files = [
    { input: 'photo_35_2026-07-06_10-49-54.jpg', output: 'hero-bg.webp' },
    { input: 'photo_32_2026-07-06_10-49-54.jpg', output: 'hero-bg-mobile.webp' },
    { input: 'photo_16_2026-07-06_10-49-54.jpg', output: 'cta-bg.webp' },
    { input: 'photo_20_2026-07-06_10-49-54.jpg', output: 'solution.webp' },
    { input: 'photo_5_2026-07-06_10-49-54.jpg', output: 'photo_5.webp' },
  ];

  for (const f of files) {
    const inputPath = path.join(imgDir, f.input);
    const outputPath = path.join(imgDir, f.output);
    try {
      const info = await sharp(inputPath)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(outputPath);
      console.log(`${f.input} -> ${f.output}: ${Math.round(info.size / 1024)}KB`);
    } catch (err) {
      console.error(`Error with ${f.input}:`, err.message);
    }
  }
}

convert();
