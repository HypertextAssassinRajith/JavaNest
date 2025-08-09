const express = require('express');
const { Product } = require('../models/Product');
const { requireAuth, requireRole } = require('../middleware/auth');
const { z } = require('zod');

const router = express.Router();

const productCreateSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  images: z.array(z.string()).optional(),
  category: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  isActive: z.boolean().optional()
});

router.get('/', async (_req, res) => {
  const products = await Product.find({ isActive: true });
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p || !p.isActive) return res.status(404).json({ message: 'Not found' });
  res.json(p);
});

router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const parsed = productCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Validation error', errors: parsed.error.flatten() });
  }
  const product = await Product.create(parsed.data);
  res.status(201).json(product);
});

router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  // partial update – validate fields that exist
  const partialSchema = productCreateSchema.partial();
  const parsed = partialSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Validation error', errors: parsed.error.flatten() });
  }
  const product = await Product.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;