const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// heic-convert is ESM-only in newer versions, so we use dynamic import
async function main() {
  const convert = (await import('heic-convert')).default;

  const SOURCE_BASE = path.join(__dirname, '..', 'public', 'products', 'HOTWHEELS -20260520T173830Z-3-001', 'HOTWHEELS');
  const DEST_BASE = path.join(__dirname, '..', 'public', 'products', 'HOTWHEELS');

  const tiers = ['399', '549', '699', '899'];
  let totalConverted = 0;
  let totalFailed = 0;

  for (const tier of tiers) {
    const srcDir = path.join(SOURCE_BASE, tier);
    const destDir = path.join(DEST_BASE, tier);

    // Create destination directory
    fs.mkdirSync(destDir, { recursive: true });

    if (!fs.existsSync(srcDir)) {
      console.log(`⚠ Source directory not found: ${srcDir}`);
      continue;
    }

    const files = fs.readdirSync(srcDir).filter(f => f.toLowerCase().endsWith('.heic'));
    console.log(`\n📁 Processing tier ₹${tier}: ${files.length} files`);

    for (const file of files) {
      const srcPath = path.join(srcDir, file);
      const baseName = path.parse(file).name;
      const destPath = path.join(destDir, `${baseName}.jpg`);

      // Skip if already converted
      if (fs.existsSync(destPath)) {
        console.log(`  ✓ Already exists: ${baseName}.jpg`);
        totalConverted++;
        continue;
      }

      try {
        console.log(`  Converting ${file}...`);
        const inputBuffer = fs.readFileSync(srcPath);
        
        const outputBuffer = await convert({
          buffer: inputBuffer,
          format: 'JPEG',
          quality: 0.9
        });

        // Use sharp to optimize and resize
        await sharp(Buffer.from(outputBuffer))
          .resize(800, 800, { fit: 'cover', withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toFile(destPath);

        totalConverted++;
        console.log(`  ✓ Converted: ${baseName}.jpg`);
      } catch (err) {
        totalFailed++;
        console.error(`  ✗ Failed: ${file} — ${err.message}`);
      }
    }
  }

  console.log(`\n🏁 Done! Converted: ${totalConverted}, Failed: ${totalFailed}`);
}

main().catch(console.error);
