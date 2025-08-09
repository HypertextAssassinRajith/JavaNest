const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: { type: [String], default: [] },
  category: { type: String, default: 'general' },
  stock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Product = model('Product', productSchema);
module.exports = { Product };