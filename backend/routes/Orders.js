const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { Product } = require('../models/Product');
const { Order } = require('../models/Order');
const { z } = require('zod');

const router = express.Router();

const orderCreateSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      qty: z.number().int().positive()
    })
  ).min(1)
});

// Create order
router.post('/', requireAuth, async (req, res) => {
  const parsed = orderCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Validation error', errors: parsed.error.flatten() });
  }
  const { items } = parsed.data;

  const productDocs = await Product.find({
    _id: { $in: items.map(i => i.productId) },
    isActive: true
  });

  const productMap = new Map(productDocs.map(p => [p._id.toString(), p]));
  let amount = 0;
  const orderItems = [];

  for (const it of items) {
    const prod = productMap.get(it.productId);
    if (!prod) return res.status(400).json({ message: 'Invalid product ' + it.productId });
    if (prod.stock < it.qty) return res.status(400).json({ message: `Insufficient stock for ${prod.title}` });
    amount += prod.price * it.qty;
    orderItems.push({
      product: prod._id,
      titleSnapshot: prod.title,
      priceSnapshot: prod.price,
      qty: it.qty
    });
  }

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    amount,
    status: 'PENDING'
  });

  res.status(201).json({ order, paymentRedirect: `/pay?orderId=${order._id}` });
});

// List orders (user = own, admin = all)
router.get('/', requireAuth, async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { user: req.user.id };
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json(orders);
});

router.get('/:id', requireAuth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Not found' });
  if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(order);
});

// Simulate payment
router.post('/:id/pay', requireAuth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Not found' });
  if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  if (order.status === 'PAID') return res.status(400).json({ message: 'Already paid' });

  for (const item of order.items) {
    const prod = await Product.findById(item.product);
    if (!prod || prod.stock < item.qty) {
      return res.status(400).json({ message: `Stock issue for ${item.titleSnapshot}` });
    }
    prod.stock -= item.qty;
    await prod.save();
  }

  order.status = 'PAID';
  await order.save();
  res.json({ message: 'Payment successful', order });
});

module.exports = router;