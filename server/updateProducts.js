import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/productModel.js';

dotenv.config();

const products = [
  {
    name: 'Basundi',
    description: 'A rich and creamy Indian dessert made with thickened milk, sugar, and flavored with cardamom and nuts.',
    price: 120,
    image: '/images/basundi.jpeg',
    category: 'Desserts',
    stock: 50,
    rating: 4.8,
    numReviews: 25
  },
  {
    name: 'Chaas',
    description: 'A refreshing buttermilk drink seasoned with cumin, mint, and other spices.',
    price: 40,
    image: '/images/chaas.jpeg',
    category: 'Drinks',
    stock: 100,
    rating: 4.5,
    numReviews: 30
  },
  {
    name: 'Chana Dal',
    description: 'A flavorful split chickpea curry cooked with aromatic spices.',
    price: 80,
    image: '/images/chana-dal.jpeg',
    category: 'Main Course',
    stock: 40,
    rating: 4.6,
    numReviews: 20
  },
  {
    name: 'Dabeli',
    description: 'A popular Gujarati street food made with spiced potato filling in a bun, garnished with pomegranate and peanuts.',
    price: 60,
    image: '/images/dabeli.jpeg',
    category: 'Snacks',
    stock: 60,
    rating: 4.7,
    numReviews: 35
  },
  {
    name: 'Dal Dhokli',
    description: 'A traditional Gujarati dish of wheat flour dumplings cooked in a sweet and sour dal.',
    price: 90,
    image: '/images/dal-dhokli.jpeg',
    category: 'Main Course',
    stock: 45,
    rating: 4.5,
    numReviews: 28
  },
  {
    name: 'Dhokla',
    description: 'A steamed savory cake made from fermented rice and chickpea batter.',
    price: 70,
    image: '/images/dhokla.jpeg',
    category: 'Snacks',
    stock: 55,
    rating: 4.8,
    numReviews: 40
  },
  {
    name: 'Doodh Pak',
    description: 'A rich rice pudding made with milk, sugar, and flavored with cardamom and nuts.',
    price: 110,
    image: '/images/doodh-pak.jpeg',
    category: 'Desserts',
    stock: 35,
    rating: 4.7,
    numReviews: 22
  },
  {
    name: 'Fafda',
    description: 'Crispy gram flour snacks, typically served with papaya chutney.',
    price: 50,
    image: '/images/fafda.jpeg',
    category: 'Snacks',
    stock: 70,
    rating: 4.6,
    numReviews: 32
  },
  {
    name: 'Gathiya',
    description: 'Crispy fried gram flour snacks, a popular Gujarati breakfast item.',
    price: 55,
    image: '/images/gathiya.jpeg',
    category: 'Snacks',
    stock: 65,
    rating: 4.5,
    numReviews: 27
  },
  {
    name: 'Gharana',
    description: 'A traditional Gujarati sweet made with gram flour and sugar syrup.',
    price: 95,
    image: '/images/gharana.jpeg',
    category: 'Desserts',
    stock: 30,
    rating: 4.4,
    numReviews: 18
  },
  {
    name: 'Ghughra',
    description: 'Sweet or savory fried pastries filled with spiced mixture.',
    price: 65,
    image: '/images/ghughra.jpeg',
    category: 'Snacks',
    stock: 50,
    rating: 4.7,
    numReviews: 25
  },
  {
    name: 'Handvo',
    description: 'A savory cake made from fermented rice, lentils, and vegetables.',
    price: 75,
    image: '/images/handvo.jpeg',
    category: 'Snacks',
    stock: 45,
    rating: 4.6,
    numReviews: 20
  },
  {
    name: 'Kadhi',
    description: 'A yogurt-based curry with gram flour dumplings, tempered with spices.',
    price: 85,
    image: '/images/kadhi.jpeg',
    category: 'Main Course',
    stock: 40,
    rating: 4.5,
    numReviews: 23
  },
  {
    name: 'Khaman',
    description: 'Soft and fluffy steamed gram flour cakes, a popular Gujarati snack.',
    price: 60,
    image: '/images/khaman.jpeg',
    category: 'Snacks',
    stock: 55,
    rating: 4.8,
    numReviews: 38
  },
  {
    name: 'Khandvi',
    description: 'Rolled gram flour crepes with tempered spices and coconut.',
    price: 70,
    image: '/images/khandvi.jpeg',
    category: 'Snacks',
    stock: 45,
    rating: 4.7,
    numReviews: 30
  },
  {
    name: 'Lassi',
    description: 'A refreshing yogurt-based drink, sweet or salty.',
    price: 45,
    image: '/images/lassi.jpeg',
    category: 'Drinks',
    stock: 80,
    rating: 4.6,
    numReviews: 35
  },
  {
    name: 'Masala Chai',
    description: 'Spiced Indian tea with milk and aromatic spices.',
    price: 40,
    image: '/images/masala-chai.jpeg',
    category: 'Drinks',
    stock: 90,
    rating: 4.8,
    numReviews: 45
  },
  {
    name: 'Muthiya',
    description: 'Steamed or fried dumplings made from gram flour and vegetables.',
    price: 65,
    image: '/images/muthiya.jpeg',
    category: 'Snacks',
    stock: 50,
    rating: 4.5,
    numReviews: 22
  },
  {
    name: 'Sev Tameta Nu Shaak',
    description: 'A tangy tomato curry with crispy gram flour noodles.',
    price: 80,
    image: '/images/sev-tameta-nu-shaak.jpeg',
    category: 'Main Course',
    stock: 40,
    rating: 4.6,
    numReviews: 25
  },
  {
    name: 'Shrikhand Lassi',
    description: 'A sweet yogurt drink flavored with saffron and cardamom.',
    price: 50,
    image: '/images/shrikhand-lassi.jpeg',
    category: 'Drinks',
    stock: 70,
    rating: 4.7,
    numReviews: 30
  },
  {
    name: 'Shrikhand',
    description: 'A sweet strained yogurt dessert flavored with saffron and cardamom.',
    price: 100,
    image: '/images/shrikhand.jpeg',
    category: 'Desserts',
    stock: 35,
    rating: 4.8,
    numReviews: 28
  },
  {
    name: 'Thandai',
    description: 'A cooling drink made with milk, nuts, and spices.',
    price: 55,
    image: '/images/thandai.jpeg',
    category: 'Drinks',
    stock: 60,
    rating: 4.6,
    numReviews: 20
  },
  {
    name: 'Thepla',
    description: 'Spiced flatbreads made with whole wheat flour and fenugreek leaves.',
    price: 45,
    image: '/images/thepla.jpeg',
    category: 'Snacks',
    stock: 75,
    rating: 4.7,
    numReviews: 40
  },
  {
    name: 'Undhiyu',
    description: 'A mixed vegetable dish cooked with spices, typically made in winter.',
    price: 120,
    image: '/images/undhiyu.jpeg',
    category: 'Main Course',
    stock: 30,
    rating: 4.8,
    numReviews: 25
  },
  {
    name: 'Vada Pav',
    description: 'A popular street food consisting of a spicy potato fritter in a bun.',
    price: 50,
    image: '/images/vada-pav.jpeg',
    category: 'Snacks',
    stock: 65,
    rating: 4.7,
    numReviews: 35
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