import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const ATLAS_URI = process.env.MONGODB_ATLAS_URI;

if (!ATLAS_URI) {
  console.error('Please set MONGODB_ATLAS_URI in your .env file');
  process.exit(1);
}

async function verifyDatabase() {
  let client;

  try {
    console.log('Connecting to Atlas...');
    client = await MongoClient.connect(ATLAS_URI);
    console.log('Connected to Atlas');

    const db = client.db();

    // Get collection names
    const collections = await db.listCollections().toArray();
    console.log('\nCollections in database:');
    collections.forEach(col => console.log(`- ${col.name}`));

    // Verify products
    const products = await db.collection('products').find({}).toArray();
    console.log('\nProducts:');
    console.log(`Total products: ${products.length}`);
    console.log('\nProduct categories distribution:');
    const categoryCount = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`- ${category}: ${count} products`);
    });

    // Verify categories
    const categories = await db.collection('categories').find({}).toArray();
    console.log('\nCategories:');
    console.log(`Total categories: ${categories.length}`);
    categories.forEach(category => {
      console.log(`- ${category.name}: ${category.description}`);
    });

    // Verify indexes
    const productIndexes = await db.collection('products').indexes();
    const categoryIndexes = await db.collection('categories').indexes();
    
    console.log('\nIndexes:');
    console.log('Products indexes:');
    productIndexes.forEach(index => {
      console.log(`- ${JSON.stringify(index.key)}`);
    });
    console.log('Categories indexes:');
    categoryIndexes.forEach(index => {
      console.log(`- ${JSON.stringify(index.key)}`);
    });

  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\nDatabase connection closed');
    }
  }
}

// Run the verification
verifyDatabase(); 