import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const updateImagePaths = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_ATLAS_URI);
    console.log('Connected to MongoDB');

    // Find all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    // Update image paths
    let updatedCount = 0;
    for (const product of products) {
      if (product.image && product.image.endsWith('.jpg')) {
        const newImagePath = product.image.replace('.jpg', '.jpeg');
        await Product.findByIdAndUpdate(product._id, { image: newImagePath });
        console.log(`Updated image path for ${product.name}: ${product.image} -> ${newImagePath}`);
        updatedCount++;
      }
    }

    console.log(`Updated ${updatedCount} product image paths`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating image paths:', error);
    process.exit(1);
  }
};

updateImagePaths(); 