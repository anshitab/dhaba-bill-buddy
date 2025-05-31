import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from '../models/Item.js';

dotenv.config();

const sampleItems = [
  { itemId: '1', name: 'Butter Chicken', price: 250 },
  { itemId: '2', name: 'Tandoori Roti', price: 30 },
  { itemId: '3', name: 'Naan', price: 40 },
  { itemId: '4', name: 'Dal Makhani', price: 180 },
  { itemId: '5', name: 'Paneer Butter Masala', price: 220 },
  { itemId: '6', name: 'Jeera Rice', price: 120 },
  { itemId: '7', name: 'Lassi', price: 60 },
  { itemId: '8', name: 'Gulab Jamun', price: 80 }
];

async function initializeDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing items
    await Item.deleteMany({});
    console.log('Cleared existing items');

    // Insert sample items
    await Item.insertMany(sampleItems);
    console.log('Added sample menu items');

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

initializeDatabase(); 