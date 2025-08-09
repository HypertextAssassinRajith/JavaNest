const bcrypt = require('bcrypt');

async function hashPassword(pw) {
  return bcrypt.hash(pw, 10);
}
async function comparePassword(pw, hash) {
  return bcrypt.compare(pw, hash);
}

module.exports = { hashPassword, comparePassword };