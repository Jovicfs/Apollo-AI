const crypto = require('crypto');

const generateStrongKey = () => {
  return crypto.randomBytes(64).toString('hex');
}

console.log(generateStrongKey());