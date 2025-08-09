const dotenv = require('dotenv');
dotenv.config();

const env = {
  PORT: process.env.PORT || '4000',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/coffee_shop',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_me',
  JWT_EXPIRES_IN: '1h'
};

module.exports = { env };