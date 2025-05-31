import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/billing_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema and model for menu items
const menuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// Endpoint to get menu items
app.get('/menu', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (Optional) Endpoint to add a menu item
app.post('/menu', async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});