const cloudinary = require('cloudinary').v2;

// ตรวจสอบว่า environment variables มีค่าหรือไม่
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Is set' : 'Is not set');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Is set' : 'Is not set');

// ตั้งค่า Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// ทดสอบการเชื่อมต่อ (แบบ async)
async function testCloudinaryConnection() {
  try {
    const result = await cloudinary.api.ping();
    console.log('Cloudinary connection successful:', result);
  } catch (error) {
    console.error('Cloudinary connection failed:', error);
  }
}

// เรียกใช้ฟังก์ชันทดสอบ
testCloudinaryConnection();