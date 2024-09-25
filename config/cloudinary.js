const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dn3keicr6', 
  api_key: '129448261855876', 
  api_secret: '-zPKwND9sI1JayMeRBR-y90BPbM' 
});

console.log('Cloudinary configuration:', {
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key ? 'Set' : 'Not Set',
  api_secret: cloudinary.config().api_secret ? 'Set' : 'Not Set'
});

module.exports = cloudinary;