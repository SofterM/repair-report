import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import History from '../components/History';
import GuidePage from './GuidePage';
import ProgressReport from '../components/ProgressReport';
import Reporthome from './Reporthome';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import LoadingSpinner from '../components/LoadingSpinner'; // Import the LoadingSpinner

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay (e.g., fetching data)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner />; // Show loading spinner while loading
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-gradient-to-b from-purple-400 to-white text-white flex-grow">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-8">
            <div className="w-full lg:w-1/2">
              <h1 className="text-3xl md:text-5xl font-bold text-purple-800 mb-4">Maintenance UP</h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-black mb-4">ACTION-PROVOKING</h2>
              <p className="text-lg md:text-xl text-black mb-8">TO HELP YOU GROW AUDIENCE</p>
              <p className="mb-8 text-black text-sm md:text-base">เว็บไซต์สำหรับรายงานสิ่งของชำรุดออนไลน์ภายในมหาวิทยาลัยพะเยา เป็นแพลตฟอร์มที่ช่วยให้ผู้แจ้งซ่อมสามารถรายงานปัญหาผ่านหน้าเว็บไซต์ได้อย่างสะดวก โดยผู้ใช้งานสามารถกรอกรายละเอียดเกี่ยวกับการแจ้งซ่อมได้ตามต้องการ นอกจากนี้ยังสามารถติดตามสถานะของการซ่อมบำรุงได้อีกด้วย</p>
            </div>
            
            <div className="w-full lg:w-1/2 flex flex-col items-center">
              <div className="w-full h-[300px] md:h-[300px] lg:h-[300px] relative mb-8">
                <img
                  src="/home1.png"
                  alt="homepage"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-end mb-8 gap-8">
            <div className="w-full lg:w-1/2 flex flex-col items-center">
              <Link to="/report" className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-8 md:px-12 py-4 md:py-8 rounded-xl text-xl md:text-3xl font-semibold hover:from-pink-500 hover:to-purple-600 transition duration-300 shadow-lg mb-4 w-full text-center">
                Report & รายงานการชำรุด
              </Link>
              <div className='text-center mt-2'>
                <Link to="/dashboard" className="border-b border-black text-black text-sm md:text-base">ประวัติรายการแจ้งซ่อมชำรุด</Link>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="w-full bg-white p-4 md:p-6 rounded-xl">
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 w-full">
                  {['ไฟตกไฟดับ', 'อินเตอร์เน็ต', 'โปรเจคเตอร์', 'จอแสดงภาพ', 'ลำโพง', 'เครื่องปรับอากาศ'].map((item, index) => (
                    <div key={index} className="bg-purple-600 bg-opacity-20 p-2 md:p-3 rounded-lg flex items-center shadow-sm">
                      <div className="w-4 h-4 md:w-6 md:h-6 bg-purple-600 rounded-full flex items-center justify-center mr-2 md:mr-3">
                        <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-black font-medium text-xs md:text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
       
      <div className="w-full">
        <History />
      </div>
      <div className="w-full">
        <Reporthome />
      </div>
      <div className="w-full">
        <ProgressReport />
      </div>
      <div className="w-full">
        <GuidePage />
      </div>
      <div className="w-full">
        <Footer />
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default HomePage;