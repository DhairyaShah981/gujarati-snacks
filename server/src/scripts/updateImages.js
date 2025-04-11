import mongoose from 'mongoose';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const updateImages = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);
    
    for (const product of products) {
      // Convert product name to filename format (lowercase, hyphenated)
      const filename = product.name
        .toLowerCase()
        .replace('gujarati ', '')
        .replace(/ /g, '-')
        + '.jpeg';
      
      // Update image path with GitHub Pages URL structure
      const imagePath = `/gujarati-snacks/images/products/${filename}`;
      await Product.findByIdAndUpdate(product._id, { image: imagePath });
      console.log(`Updated image path for ${product.name} to ${imagePath}`);
    }
    
    // Verify all products have image paths
    const productsWithoutImages = await Product.find({ image: { $in: [null, ''] } });
    if (productsWithoutImages.length > 0) {
      console.log('\nWarning: Found products without images:');
      productsWithoutImages.forEach(p => console.log(`- ${p.name}`));
    } else {
      console.log('\nAll products have image paths set correctly!');
    }
    
    console.log('\nImage update completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateImages(); 