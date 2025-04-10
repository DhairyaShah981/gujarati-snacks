import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const products = [
  {
    name: 'Gujarati Fafda',
    description: 'Crispy, savory snack made from chickpea flour and spices',
    price: 199.99,
    image: '/images/products/fafda.jpg',
    category: 'snacks',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Dhokla',
    description: 'Soft, spongy snack made from fermented rice and chickpea flour',
    price: 149.99,
    image: '/images/products/dhokla.jpg',
    category: 'snacks',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Khandvi',
    description: 'Rolled savory snack made from gram flour and yogurt',
    price: 179.99,
    image: '/images/products/khandvi.jpg',
    category: 'snacks',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Thepla',
    description: 'Flatbread made with fenugreek leaves and spices',
    price: 129.99,
    image: '/images/products/thepla.jpg',
    category: 'snacks',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Gathiya',
    description: 'Crispy snack made from chickpea flour and spices',
    price: 159.99,
    image: '/images/products/gathiya.jpg',
    category: 'snacks',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Khaman',
    description: 'Spongy snack made from chickpea flour and spices',
    price: 139.99,
    image: '/images/products/khaman.jpg',
    category: 'snacks',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Handvo',
    description: 'Savory cake made from rice and lentils',
    price: 169.99,
    image: '/images/products/handvo.jpg',
    category: 'snacks',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Muthiya',
    description: 'Steamed dumplings made from wheat flour and vegetables',
    price: 149.99,
    image: '/images/products/muthiya.jpg',
    category: 'snacks',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Dabeli',
    description: 'Spicy potato filling in a burger bun',
    price: 89.99,
    image: '/images/products/dabeli.jpg',
    category: 'snacks',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Vada Pav',
    description: 'Spicy potato fritter in a burger bun',
    price: 79.99,
    image: '/images/products/vada-pav.jpg',
    category: 'snacks',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Ghughra',
    description: 'Sweet pastry filled with nuts and spices',
    price: 199.99,
    image: '/images/products/ghughra.jpg',
    category: 'sweets',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Shrikhand',
    description: 'Sweet yogurt dessert with cardamom and saffron',
    price: 179.99,
    image: '/images/products/shrikhand.jpg',
    category: 'sweets',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Basundi',
    description: 'Sweet milk dessert with cardamom and nuts',
    price: 189.99,
    image: '/images/products/basundi.jpg',
    category: 'sweets',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Gharana',
    description: 'Sweet fritters made from milk and flour',
    price: 169.99,
    image: '/images/products/gharana.jpg',
    category: 'sweets',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Doodh Pak',
    description: 'Sweet rice pudding with cardamom and nuts',
    price: 159.99,
    image: '/images/products/doodh-pak.jpg',
    category: 'sweets',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Chana Dal',
    description: 'Spicy and tangy chickpea lentils',
    price: 139.99,
    image: '/images/products/chana-dal.jpg',
    category: 'savories',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Undhiyu',
    description: 'Mixed vegetable curry with spices',
    price: 199.99,
    image: '/images/products/undhiyu.jpg',
    category: 'savories',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Kadhi',
    description: 'Yogurt-based curry with spices',
    price: 149.99,
    image: '/images/products/kadhi.jpg',
    category: 'savories',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Dal Dhokli',
    description: 'Wheat flour dumplings in spiced lentils',
    price: 169.99,
    image: '/images/products/dal-dhokli.jpg',
    category: 'savories',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Sev Tameta Nu Shaak',
    description: 'Tomato curry with crispy sev',
    price: 139.99,
    image: '/images/products/sev-tameta.jpg',
    category: 'savories',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Masala Chai',
    description: 'Spiced tea with milk and cardamom',
    price: 49.99,
    image: '/images/products/masala-chai.jpg',
    category: 'beverages',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Thandai',
    description: 'Cold milk drink with nuts and spices',
    price: 59.99,
    image: '/images/products/thandai.jpg',
    category: 'beverages',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Lassi',
    description: 'Sweet yogurt drink with cardamom',
    price: 39.99,
    image: '/images/products/lassi.jpg',
    category: 'beverages',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Chaas',
    description: 'Spiced buttermilk drink',
    price: 29.99,
    image: '/images/products/chaas.jpg',
    category: 'beverages',
    stock: 100,
    isAvailable: true,
  },
  {
    name: 'Gujarati Shrikhand Lassi',
    description: 'Sweet yogurt drink with saffron and nuts',
    price: 49.99,
    image: '/images/products/shrikhand-lassi.jpg',
    category: 'beverages',
    stock: 100,
    isAvailable: true,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log('Inserted new products');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 