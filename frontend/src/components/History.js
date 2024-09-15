import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const allCategoriesRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const categories = [
    {
      title: "ไมค์โครโฟน",
      details: ["ไมค์ไม่ดัง", "ไมค์ไม่ทำงาน"],
      icon: "/icons/Microphone.png",
      color: "#0FD7FF",
    },
    {
      title: "โปรเจคเตอร์",
      details: [
        "ภาพไม่ชัด/เบลอ/มีจุด",
        "เปิดไม่ติด/หลอดเสื่อม",
        "ภาพกระพริบ/สีผิดเพี้ยน/ภาพแตก",
        "ภาพเพี้ยนและเสียงไม่ตรงปาก",
      ],
      icon: "/icons/Projector.png",
      color: "#2A50AF",
    },
    {
      title: "ลำโพง",
      details: [
        "เสียงไม่ดัง/ไม่มีเสียง",
        "เสียงขาดหาย/เสียงกระตุก/เสียงซ่า",
        "เสียงคุณภาพไม่ดี/เสียงแหลม",
        "ลำโพงไม่ทำงาน",
      ],
      icon: "/icons/Speaker.png",
      color: "#FF834B",
    },
    {
      title: "อินเตอร์เน็ต",
      details: [
        "ไม่สามารถเชื่อมต่ออินเตอร์เน็ต",
        "สัญญาณอินเตอร์เน็ตช้า",
        "สัญญาณหลุดบ่อย/ไม่เสถียร",
        "หลุดการเชื่อมต่อบ่อยครั้ง",
      ],
      icon: "/icons/rountor.png",
      color: "#E72AFF",
    },
    {
      title: "จอแสดงภาพ",
      details: [
        "ไม่สามารถเชื่อมต่อจอแสดงได้",
        "จอแสดงผลไม่ติด/ดับ",
        "ภาพกระพริบ/สีผิดเพี้ยน/ภาพแตก",
        "ขึ้นแถบสีดำและขอบจอกระพริบ",
      ],
      icon: "/icons/Monitor.png",
      color: "#F4CE14",
    },
    {
      title: "เครื่องปรับอากาศ",
      details: [
        "เครื่องปรับอากาศไม่เย็น",
        "เครื่องปรับอากาศมีกลิ่นไม่พึงประสงค์",
        "เครื่องปรับอากาศมีเสียงดังผิดปกติ",
        "เครื่องปรับอากาศรั่วซึม",
      ],
      icon: "/icons/Aircooler.png",
      color: "#34E940",
    },
  ];

  const handleCategoryClick = (category) => {
    navigate(`/dashboard?category=${encodeURIComponent(category)}`);
  };

  const visibleCategories = isMobile && !showAll ? categories.slice(0, 3) : categories;

  const handleShowAll = () => {
    setShowAll(true);
    if (allCategoriesRef.current) {
      allCategoriesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 relative overflow-hidden">
      <img src="/icons/Sky3.png" alt="Cloud 1" className="absolute bottom-48 left-0 w-64 " />
      <img src="/icons/Sky1.png" alt="Cloud 2" className="absolute top-24 right-10 w-72 " />
      <img src="/icons/Sky2.png" alt="Cloud 3" className="absolute bottom-0 right-0 w-64 " />

      <section className="mt-16 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-4 text-center">
          ประวัติรายงานการแจ้งของชำรุด
        </h2>
        <h4 className="text-black text-center mb-8">
          ประวัติรายการแจ้งของชำรุดเสียหายภายในมหาวิทยาลัยพะเยา
          <br />
          ประกอบไปด้วยไมโครโฟนชำรุด, โปรเจคเตอร์ชำรุด, ลำโพงชำรุด,
          อินเตอร์เน็ตชำรุด และจอแสดงภาพชำรุด
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:px-40">
          {visibleCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white shadow-lg flex flex-col min-h-52 cursor-pointer"
              style={{
                borderWidth: "2px",
                borderStyle: "solid",
                borderColor: category.color,
                borderRadius: "1rem",
                padding: "1rem",
              }}
              onClick={() => handleCategoryClick(category.title)}
            >
              <div className="flex items-center mb-4">
                <img
                  src={category.icon}
                  alt={category.title}
                  className="w-[40px] h-[40px] mr-3"
                />
                <h3
                  className="text-xl font-semibold"
                  style={{ color: category.color }}
                >
                  {category.title}
                </h3>
              </div>
              <h1 className="text-2xl font-semibold mb-2 text-gray-500">
                รายละเอียด
              </h1>
              <h4 className="text-gray-500 mb-2">
                ตัวอย่าง
              </h4>
              <ul className="text-gray-400 text-sm flex-grow">
                {category.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start mb-2">
                    <div className="w-1 h-1 rounded-full mr-2 mt-1.5 flex-shrink-0 bg-gray-400"></div>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-start mt-4">
                <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 12H38M38 12L28 2M38 12L28 22" stroke={category.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div ref={allCategoriesRef} className="mt-8"></div>

        {isMobile && !showAll && categories.length > 3 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleShowAll}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              ดูเพิ่มเติม
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default History;