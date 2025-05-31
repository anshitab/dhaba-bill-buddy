import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from './models/Item.js';

dotenv.config();

const sampleItems = [
  {
    itemId: "BC001",
    name: "Butter Chicken",
    price: 250,
    category: "Main Course",
    description: "Tender chicken in a rich, creamy tomato-based curry"
  },
  {
    itemId: "VB001",
    name: "Veg Biryani",
    price: 180,
    category: "Main Course",
    description: "Fragrant basmati rice cooked with mixed vegetables and spices"
  },
  {
    itemId: "PBM001",
    name: "Paneer Butter Masala",
    price: 220,
    category: "Main Course",
    description: "Cottage cheese cubes in a rich, creamy tomato gravy"
  },
  {
    itemId: "N001",
    name: "Naan",
    price: 30,
    category: "Breads",
    description: "Soft, fluffy flatbread baked in tandoor"
  },
  {
    itemId: "MC001",
    name: "Masala Chai",
    price: 20,
    category: "Beverages",
    description: "Spiced Indian tea with milk"
  }
];

const initializeDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing items
    await Item.deleteMany({});
    console.log('Cleared existing items');

    // Insert sample items
    await Item.insertMany(sampleItems);
    console.log('Added sample menu items');

    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initializeDb(); 