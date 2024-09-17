import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const ProgressReportLayout = () => {
  const [reports, setReports] = useState([]);
  const [, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/reports');
      setReports(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to fetch reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const getCounts = () => {
    return {
      totalReports: reports.length,
      userReports: user ? reports.filter(report => report.createdBy === user._id).length : 0,
      inProgress: reports.filter(report => report.status === 'กำลังดำเนินการ').length,
      completed: reports.filter(report => report.status === 'เสร็จสิ้น').length
    };
  };

  const counts = getCounts();

  if (loading) {
    return <div className="text-center mt-8">กำลังโหลด...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-purple-400 flex items-center justify-center p-4 pt-[100px] overflow-x-hidden">
      <div className="max-w-6xl w-full relative">
        {/* Decorative elements */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:block hidden">
          <img src="/icons/gear.png" alt="Decorative sphere" className="w-full h-full object-contain transform scale-150" />
        </div>
        <div className="absolute top-14 left-10 w-48 h-48 md:block hidden">
          <img src="/icons/robot.png" alt="robot" className="w-full h-full object-contain transform scale-125 translate-x-1/4 -translate-y-1/4" />
        </div>
        <div className="absolute -bottom-16 -right-8 w-48 h-32 md:block hidden">
           <img src="/icons/tool.png" alt="Decorative tools" className="w-full h-full object-contain transform scale-125 translate-x-1/4 translate-y-1/4" />
        </div>
        {/* Gear for mobile view */}
        {/* Mobile view */}
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-32 h-32 md:hidden">
          <img src="/icons/gear.png" alt="Decorative gear" className="w-full h-full object-contain transform scale-100" />
        </div>
       
        {/* Main content */}
        <div className="relative z-10 text-center mb-12 flex items-center justify-center mt-24">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">รายละเอียดการดำเนินงาน</h1>
            <h2 className="text-2xl md:text-4xl font-bold mb-6">Report in progress</h2>
            <p className="text-base md:text-xl text-black max-w-2xl mx-auto">
              รายละเอียดการดำเนินงานการติดตามขั้นตอนการดำเนินต่าง ๆ ที่ได้รับแจ้ง
            </p>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="bg-white rounded-3xl shadow-lg px-6 md:px-12 py-8 md:py-12 flex flex-wrap justify-between items-start relative">
          <StatItem
            icon={<BellIcon className="w-8 md:w-12 h-8 md:h-12 text-red-500" />}
            value={counts.totalReports}
            label="รายงานทั้งหมด"
            dotColor="bg-red-500"
            description="จำนวนรายงานทั้งหมดในระบบ"
          />
          <StatItem
            icon={<BookmarkIcon className="w-8 md:w-12 h-8 md:h-12 text-blue-500" />}
            value={counts.userReports}
            label="รายงานของคุณ"
            dotColor="bg-blue-500"
            description={user ? "จำนวนรายงานที่คุณสร้าง" : "กรุณาเข้าสู่ระบบเพื่อดูรายงานของคุณ"}
          />
          <StatItem
            icon={<GearIcon className="w-8 md:w-12 h-8 md:h-12 text-yellow-500" />}
            value={counts.inProgress}
            label="กำลังดำเนินการ"
            dotColor="bg-yellow-500"
            description="รายงานที่อยู่ระหว่างการดำเนินการ"
          />
          <StatItem
            icon={<CheckIcon className="w-8 md:w-12 h-8 md:h-12 text-green-500" />}
            value={counts.completed}
            label="เสร็จสิ้น"
            dotColor="bg-green-500"
            description="รายงานที่ดำเนินการเสร็จสิ้นแล้ว"
          />
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ icon, value, label, dotColor, description }) => (
  <div className="flex flex-col items-center w-1/2 md:w-auto mb-6 md:mb-0">
    <div className="mb-3">{icon}</div>
    <div className="text-2xl md:text-4xl font-bold mb-2">{value}</div>
    <div className="flex items-center mb-2">
      <div className={`w-3 h-3 rounded-full ${dotColor} mr-2`}></div>
      <div className="text-sm md:text-base text-gray-500">{label}</div>
    </div>
    <div className="text-xs md:text-sm text-gray-400 text-center">{description}</div>
  </div>
);

const BellIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const BookmarkIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const GearIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default ProgressReportLayout;