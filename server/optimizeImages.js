import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const optimizeImage = async (inputPath, outputPath, size) => {
  try {
    await sharp(inputPath)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toFile(outputPath);
    console.log(`Optimized ${path.basename(inputPath)} to ${size}x${size}`);
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error);
  }
};

const processImages = async () => {
  const inputDir = path.join(__dirname, '../public/images/products');
  const outputDir = path.join(__dirname, '../public/images/products/optimized');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Get all image files
  const files = fs.readdirSync(inputDir).filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file)
  );

  // Process each image
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const fileName = path.parse(file).name;

    // Create different sizes
    await Promise.all([
      optimizeImage(inputPath, path.join(outputDir, `${fileName}-small.webp`), 300),
      optimizeImage(inputPath, path.join(outputDir, `${fileName}-medium.webp`), 600),
      optimizeImage(inputPath, path.join(outputDir, `${fileName}-large.webp`), 1200)
    ]);
  }
};

processImages().then(() => {
  console.log('Image optimization complete!');
}).catch(error => {
  console.error('Error processing images:', error);
}); 