const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash');
const { env } = require('../config/env');
const { requireAuth } = require('../middleware/auth');
const { z } = require('zod');

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().optional()
});

router.post('/register', async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Validation error', errors: parsed.error.flatten() });
    }
    const { name, email, password, role } = parsed.data;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already used' });
    const passwordHash = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role === 'admin' ? 'admin' : 'customer'
    });
    return res.json({ id: user._id, email: user.email });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Validation error', errors: parsed.error.flatten() });
  }
  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  res.json({
    token,
    user: { id: user._id, email: user.email, role: user.role, name: user.name }
  });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;