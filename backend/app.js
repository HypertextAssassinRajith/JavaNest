const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { env } = require('./config/env');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

async function bootstrap() {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('Mongo connected');

    const app = express();
    
    // CORS for production
    const corsOptions = {
      origin: [
        'http://localhost:5173', // dev
        env.FRONTEND_ORIGIN || 'https://javanest-frontend.onrender.com' // prod
      ],
      credentials: true
    };
    app.use(cors(corsOptions));
    app.use(helmet());
    app.use(express.json());
    app.use(morgan('dev'));
    app.use(rateLimit({ windowMs: 60 * 1000, limit: 100 }));

    app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
    app.use('/api/auth', authRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/orders', orderRoutes);

    // 404 fallback
    app.use((req, res) => {
      res.status(404).json({ message: 'Route not found' });
    });

    // Error handler
    app.use((err, _req, res, _next) => {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    });

    app.listen(env.PORT, () => {
      console.log(`API listening on :${env.PORT}`);
    });
  } catch (e) {
    console.error('Startup error', e);
    process.exit(1);
  }
}

bootstrap();