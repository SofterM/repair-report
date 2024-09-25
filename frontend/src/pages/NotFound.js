import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-4">ขออภัย ไม่พบหน้าที่คุณกำลังค้นหา</p>
      <Link to="/" className="text-blue-500 hover:text-blue-700">กลับไปหน้าหลัก</Link>
    </div>
  );
};

export default NotFound;