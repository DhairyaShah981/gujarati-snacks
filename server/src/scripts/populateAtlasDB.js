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

const products = [
  {
    name: "Gujarati Farsan Platter",
    description: "A delightful assortment of traditional Gujarati snacks including dhokla, khandvi, and more.",
    price: 299,
    category: "farsan",
    image: "/images/products/gujarati-farsan-platter.jpg",
    stock: 50,
    isAvailable: true
  },
  {
    name: "Masala Puri",
    description: "Crispy puris topped with spicy masala and chutneys.",
    price: 149,
    category: "snacks",
    image: "/images/products/masala-puri.jpg",
    stock: 100,
    isAvailable: true
  },
  {
    name: "Gujarati Thali",
    description: "Complete meal with dal, kadhi, sabzi, roti, and more.",
    price: 199,
    category: "snacks",
    image: "/images/products/gujarati-thali.jpg",
    stock: 30,
    isAvailable: true
  },
  {
    name: "Khandvi",
    description: "Rolled savory snack made from gram flour and yogurt.",
    price: 99,
    category: "farsan",
    image: "/images/products/khandvi.jpg",
    stock: 40,
    isAvailable: true
  },
  {
    name: "Dhokla",
    description: "Steamed savory cake made from fermented rice and chickpea flour.",
    price: 89,
    category: "farsan",
    image: "/images/products/dhokla.jpg",
    stock: 45,
    isAvailable: true
  },
  {
    name: "Gujarati Kadhi",
    description: "Yogurt-based curry with pakoras.",
    price: 79,
    category: "snacks",
    image: "/images/products/gujarati-kadhi.jpg",
    stock: 35,
    isAvailable: true
  },
  {
    name: "Thepla",
    description: "Flatbread made with fenugreek leaves and spices.",
    price: 69,
    category: "snacks",
    image: "/images/products/thepla.jpg",
    stock: 60,
    isAvailable: true
  },
  {
    name: "Gujarati Dal",
    description: "Traditional Gujarati style dal with jaggery and spices.",
    price: 59,
    category: "snacks",
    image: "/images/products/gujarati-dal.jpg",
    stock: 50,
    isAvailable: true
  },
  {
    name: "Fafda",
    description: "Crispy snack made from gram flour and spices.",
    price: 49,
    category: "farsan",
    image: "/images/products/fafda.jpg",
    stock: 70,
    isAvailable: true
  },
  {
    name: "Gujarati Khichdi",
    description: "Comfort food made with rice, lentils, and spices.",
    price: 89,
    category: "snacks",
    image: "/images/products/gujarati-khichdi.jpg",
    stock: 40,
    isAvailable: true
  },
  {
    name: "Gujarati Kadhi Pakora",
    description: "Crispy pakoras in yogurt-based curry.",
    price: 129,
    category: "snacks",
    image: "/images/products/gujarati-kadhi-pakora.jpg",
    stock: 30,
    isAvailable: true
  },
  {
    name: "Gujarati Undhiyu",
    description: "Traditional mixed vegetable dish cooked in earthen pot.",
    price: 159,
    category: "snacks",
    image: "/images/products/gujarati-undhiyu.jpg",
    stock: 25,
    isAvailable: true
  },
  {
    name: "Gujarati Handvo",
    description: "Savory cake made with rice, lentils, and vegetables.",
    price: 99,
    category: "farsan",
    image: "/images/products/gujarati-handvo.jpg",
    stock: 35,
    isAvailable: true
  },
  {
    name: "Gujarati Sev",
    description: "Crispy vermicelli made from gram flour.",
    price: 39,
    category: "farsan",
    image: "/images/products/gujarati-sev.jpg",
    stock: 80,
    isAvailable: true
  },
  {
    name: "Gujarati Gathiya",
    description: "Crispy snack made from gram flour.",
    price: 49,
    category: "farsan",
    image: "/images/products/gujarati-gathiya.jpg",
    stock: 65,
    isAvailable: true
  }
];

const categories = [
  {
    name: "farsan",
    description: "Traditional Gujarati snacks and appetizers",
    image: "/images/categories/farsan.jpg"
  },
  {
    name: "sweets",
    description: "Traditional Gujarati sweets and desserts",
    image: "/images/categories/sweets.jpg"
  },
  {
    name: "snacks",
    description: "Quick and delicious Gujarati snacks",
    image: "/images/categories/snacks.jpg"
  },
  {
    name: "beverages",
    description: "Traditional Gujarati drinks and beverages",
    image: "/images/categories/beverages.jpg"
  }
];

async function populateDatabase() {
  let client;

  try {
    console.log('Connecting to Atlas...');
    client = await MongoClient.connect(ATLAS_URI);
    console.log('Connected to Atlas');

    const db = client.db();

    // Drop existing collections
    console.log('Dropping existing collections...');
    await db.collection('products').drop().catch(() => console.log('Products collection does not exist'));
    await db.collection('categories').drop().catch(() => console.log('Categories collection does not exist'));

    // Insert products
    console.log('Inserting products...');
    const productsResult = await db.collection('products').insertMany(products);
    console.log(`Inserted ${productsResult.insertedCount} products`);

    // Insert categories
    console.log('Inserting categories...');
    const categoriesResult = await db.collection('categories').insertMany(categories);
    console.log(`Inserted ${categoriesResult.insertedCount} categories`);

    // Create indexes
    console.log('Creating indexes...');
    await db.collection('products').createIndex({ name: 1 });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('categories').createIndex({ name: 1 });

    console.log('\nDatabase population completed successfully!');
  } catch (error) {
    console.error('Error during database population:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Database connection closed');
    }
  }
}

// Run the population script
populateDatabase(); 