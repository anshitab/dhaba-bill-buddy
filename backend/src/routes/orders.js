import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Item from '../models/Item.js';

const router = express.Router();

// Generate unique order ID
const generateOrderId = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD${year}${month}${day}${random}`;
};

// Get all orders (with pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments();

    res.json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new order
router.post('/', [
  body('items').isArray().notEmpty(),
  body('items.*.itemId').notEmpty(),
  body('items.*.quantity').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items } = req.body;
    let totalAmount = 0;
    const orderItems = [];

    // Calculate total amount and validate items
    for (const orderItem of items) {
      const item = await Item.findOne({ itemId: orderItem.itemId });
      if (!item) {
        return res.status(400).json({ message: `Item ${orderItem.itemId} not found` });
      }
      
      const itemTotal = item.price * orderItem.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        itemId: item.itemId,
        quantity: orderItem.quantity,
        price: item.price
      });
    }

    const order = new Order({
      orderId: generateOrderId(),
      items: orderItems,
      totalAmount
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 