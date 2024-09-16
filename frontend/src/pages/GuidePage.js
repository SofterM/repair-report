import React from 'react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';

const GuidePage = () => {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 mt-8 ">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mb-1 mt-8 ">คำแนะนำ</h1>
        <h1 className="text-3xl md:text-3xl font-bold text-black mb-5">การใช้งานเว็บไซต์</h1>
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0 mt-5">
          <TypeAnimation
          sequence={[
            '🛠️ Maintenance UP เว็บไซต์แจ้งซ่อมออนไลน์สำหรับองค์กรของคุณ 🏢 ช่วยให้การแจ้งซ่อมและติดตามสถานะการซ่อมเป็นเรื่องง่าย 📱 ผู้ใช้งานสามารถแจ้งปัญหาผ่านระบบออนไลน์ได้อย่างสะดวก พร้อมระบุรายละเอียดการแจ้งซ่อมได้อย่างครบถ้วน ✅ ไม่ว่าจะเป็นประเภทงานซ่อม ประเภทปัญหา ชื่ออุปกรณ์ที่ต้องการซ่อม ความเร่งด่วนของงาน และรายละเอียดปัญหาที่พบ พร้อมทั้งแนบไฟล์ประกอบการแจ้งซ่อมได้อีกด้วย ทำให้การจัดการงานซ่อมบำรุงเป็นเรื่องง่ายและมีประสิทธิภาพยิ่งขึ้น!',
            500, // ระยะเวลาที่ไว้หลังข้อความจบ 1 วินาที
          ]}
          wrapper="p"
          cursor={true}
          repeat={0}
          style={{ fontSize: '1.25rem', lineHeight: '1.75rem', marginBottom: '1rem' }}
        />
            
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-6">
              <Link
                to="/report"
                className="bg-purple-600 text-white text-lg px-8 py-4 rounded-md hover:bg-purple-700 transition duration-300 text-center"
              >
                รายงานการชำรุด
              </Link>
              <Link
                to="/dashboard"
                className="bg-gray-200 text-black text-lg px-8 py-4 rounded-md hover:bg-gray-300 transition duration-300 text-center"
              >
                ประวัติรายการ
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 mt-8 md:mt-0 overflow-hidden">
            <div className="transform scale-130 origin-center">
              <img
                src="/Website recommendations.png"
                alt="คำแนะนำการใช้งาน"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;