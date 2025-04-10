import mongoose from 'mongoose';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const productUpdates = {
  // Snacks
  'Gujarati Fafda': { category: 'snacks', price: 120 },
  'Gujarati Gathiya': { category: 'snacks', price: 100 },
  'Gujarati Khaman': { category: 'snacks', price: 150 },
  'Gujarati Dhokla': { category: 'snacks', price: 140 },
  'Gujarati Khandvi': { category: 'snacks', price: 160 },
  'Gujarati Handvo': { category: 'snacks', price: 180 },
  'Gujarati Muthiya': { category: 'snacks', price: 130 },
  'Gujarati Dabeli': { category: 'snacks', price: 60 },
  'Gujarati Vada Pav': { category: 'snacks', price: 50 },
  
  // Sweets
  'Gujarati Ghughra': { category: 'sweets', price: 200 },
  'Gujarati Shrikhand': { category: 'sweets', price: 250 },
  'Gujarati Basundi': { category: 'sweets', price: 220 },
  'Gujarati Doodh Pak': { category: 'sweets', price: 280 },
  
  // Savories
  'Gujarati Thepla': { category: 'savories', price: 150 },
  'Gujarati Undhiyu': { category: 'savories', price: 300 },
  'Gujarati Kadhi': { category: 'savories', price: 180 },
  'Gujarati Dal Dhokli': { category: 'savories', price: 200 },
  'Gujarati Sev Tameta Nu Shaak': { category: 'savories', price: 160 },
  'Gujarati Chana Dal': { category: 'savories', price: 170 },
  'Gujarati Gharana': { category: 'savories', price: 250 },
  
  // Beverages
  'Gujarati Masala Chai': { category: 'beverages', price: 40 },
  'Gujarati Thandai': { category: 'beverages', price: 80 },
  'Gujarati Lassi': { category: 'beverages', price: 60 },
  'Gujarati Chaas': { category: 'beverages', price: 40 },
  'Gujarati Shrikhand Lassi': { category: 'beverages', price: 90 }
};

const updateProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);
    
    for (const product of products) {
      const updates = productUpdates[product.name];
      if (updates) {
        await Product.findByIdAndUpdate(product._id, {
          category: updates.category,
          price: updates.price
        });
        console.log(`Updated ${product.name} - Category: ${updates.category}, Price: ₹${updates.price}`);
      }
    }
    
    console.log('All products updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateProducts(); 