const { Schema, model } = require('mongoose');

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  titleSnapshot: { type: String, required: true },
  priceSnapshot: { type: Number, required: true },
  qty: { type: Number, required: true }
});

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [orderItemSchema], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'PAID', 'CANCELLED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

const Order = model('Order', orderSchema);
module.exports = { Order };