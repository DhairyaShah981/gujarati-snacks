import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/productModel.js';

dotenv.config();

const products = [
  {
    name: 'Khaman',
    description: 'Soft and fluffy steamed gram flour snack',
    price: 50,
    category: 'farsan',
    image: '/images/products/optimized/khaman-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Dhokla',
    description: 'Steamed fermented rice and chickpea flour cake',
    price: 60,
    category: 'farsan',
    image: '/images/products/optimized/dhokla-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Gathiya',
    description: 'Crispy fried gram flour snack',
    price: 40,
    category: 'farsan',
    image: '/images/products/optimized/gathiya-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Basundi',
    description: 'Sweetened condensed milk dessert',
    price: 80,
    category: 'sweets',
    image: '/images/products/optimized/basundi-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Jalebi',
    description: 'Crispy spiral-shaped sweet soaked in sugar syrup',
    price: 45,
    category: 'sweets',
    image: '/images/products/optimized/jalebi-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Samosa',
    description: 'Crispy fried pastry with spiced potato filling',
    price: 30,
    category: 'snacks',
    image: '/images/products/optimized/samosa-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Kachori',
    description: 'Deep-fried pastry with spiced lentil filling',
    price: 35,
    category: 'snacks',
    image: '/images/products/optimized/kachori-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Masala Chai',
    description: 'Spiced Indian tea with milk',
    price: 25,
    category: 'beverages',
    image: '/images/products/optimized/masala-chai-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Lassi',
    description: 'Sweet or salty yogurt-based drink',
    price: 40,
    category: 'beverages',
    image: '/images/products/optimized/lassi-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Chaas',
    description: 'A refreshing buttermilk drink seasoned with cumin, mint, and other spices',
    price: 40,
    category: 'beverages',
    image: '/images/products/optimized/chaas-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Chana Dal',
    description: 'A flavorful split chickpea curry cooked with aromatic spices',
    price: 80,
    category: 'snacks',
    image: '/images/products/optimized/chana-dal-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Dabeli',
    description: 'A popular Gujarati street food made with spiced potato filling in a bun, garnished with pomegranate and peanuts',
    price: 60,
    category: 'snacks',
    image: '/images/products/optimized/dabeli-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Dal Dhokli',
    description: 'A traditional Gujarati dish of wheat flour dumplings cooked in a sweet and sour dal',
    price: 90,
    category: 'snacks',
    image: '/images/products/optimized/dal-dhokli-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Doodh Pak',
    description: 'A rich rice pudding made with milk, sugar, and flavored with cardamom and nuts',
    price: 110,
    category: 'sweets',
    image: '/images/products/optimized/doodh-pak-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Fafda',
    description: 'Crispy gram flour snacks, typically served with papaya chutney',
    price: 50,
    category: 'farsan',
    image: '/images/products/optimized/fafda-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Gharana',
    description: 'A traditional Gujarati sweet made with gram flour and sugar syrup',
    price: 95,
    category: 'sweets',
    image: '/images/products/optimized/gharana-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Ghughra',
    description: 'Sweet or savory fried pastries filled with spiced mixture',
    price: 65,
    category: 'snacks',
    image: '/images/products/optimized/ghughra-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Handvo',
    description: 'A savory cake made from fermented rice, lentils, and vegetables',
    price: 75,
    category: 'farsan',
    image: '/images/products/optimized/handvo-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Kadhi',
    description: 'A yogurt-based curry with gram flour dumplings, tempered with spices',
    price: 85,
    category: 'snacks',
    image: '/images/products/optimized/kadhi-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Khandvi',
    description: 'Rolled gram flour crepes with tempered spices and coconut',
    price: 70,
    category: 'farsan',
    image: '/images/products/optimized/khandvi-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Muthiya',
    description: 'Steamed or fried dumplings made from gram flour and vegetables',
    price: 65,
    category: 'farsan',
    image: '/images/products/optimized/muthiya-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Sev Tameta Nu Shaak',
    description: 'A tangy tomato curry with crispy gram flour noodles',
    price: 80,
    category: 'snacks',
    image: '/images/products/optimized/sev-tameta-nu-shaak-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Shrikhand Lassi',
    description: 'A sweet yogurt drink flavored with saffron and cardamom',
    price: 50,
    category: 'beverages',
    image: '/images/products/optimized/shrikhand-lassi-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Shrikhand',
    description: 'A sweet strained yogurt dessert flavored with saffron and cardamom',
    price: 100,
    category: 'sweets',
    image: '/images/products/optimized/shrikhand-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Thandai',
    description: 'A cooling drink made with milk, nuts, and spices',
    price: 55,
    category: 'beverages',
    image: '/images/products/optimized/thandai-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Thepla',
    description: 'Spiced flatbreads made with whole wheat flour and fenugreek leaves',
    price: 45,
    category: 'snacks',
    image: '/images/products/optimized/thepla-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Undhiyu',
    description: 'A mixed vegetable dish cooked with spices, typically made in winter',
    price: 120,
    category: 'snacks',
    image: '/images/products/optimized/undhiyu-medium.webp',
    isAvailable: true,
    stock: 100
  },
  {
    name: 'Vada Pav',
    description: 'A popular street food consisting of a spicy potato fritter in a bun',
    price: 50,
    category: 'snacks',
    image: '/images/products/optimized/vada-pav-medium.webp',
    isAvailable: true,
    stock: 100
  }
];

const updateProducts = async () => {
  try {
    // Connect to MongoDB
    const mongoOptions = JSON.parse(process.env.MONGODB_OPTIONS || '{}');
    await mongoose.connect(process.env.MONGODB_ATLAS_URI, mongoOptions);
    console.log('Connected to MongoDB');

    // Delete all existing products
    await Product.deleteMany({});
    console.log('Deleted all existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`Successfully inserted ${insertedProducts.length} products`);

    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateProducts(); 