import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Navbar = ({ show = true, notificationCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.error('ออกจากระบบเรียบร้อยแล้ว');
    navigate('/login');
    setIsOpen(false);
  };

  if (!show) {
    return null;
  }

  const NavLink = ({ to, children, mobile = false, badge = null }) => {
    const isActive = location.pathname === to;
    const baseClasses = isActive
      ? 'font-bold text-purple-600'
      : 'text-black hover:text-purple-600';
    const mobileClasses = mobile ? 'block py-2 px-4 text-lg ' : '';
    const desktopClasses = !mobile ? 'relative ' : '';

    return (
      <Link
        to={to}
        className={`${baseClasses} ${mobileClasses} ${desktopClasses} relative`}
        onClick={() => mobile && setIsOpen(false)}
      >
        {children}
        {isActive && !mobile && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600"></span>
        )}
        {badge && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <header className="container mx-auto px-4 py-6">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-purple-500 text-white rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Desktop navbar */}
      <div className="hidden md:flex flex-row justify-between items-center">
        <div className="w-48 h-48 relative">
          <Link to="/">
            <img 
              src="https://upload.wikimedia.org/wikipedia/th/0/00/University_of_Phayao_Logo.svg" 
              alt="UP Logo" 
              className="w-full h-full object-contain cursor-pointer"
            />
          </Link>
        </div>
        <nav className="bg-white rounded-full flex flex-wrap justify-center items-center px-6 py-3 space-x-4">
          <NavLink to="/">หน้าหลัก</NavLink>
          <NavLink to="/report">แจ้งของชำรุด</NavLink>
          <NavLink to="/dashboard">รายการทั้งหมด</NavLink>
          {isLoggedIn ? (
            <>
              {user && user.role === 'admin' && (
                <NavLink to="/admin" badge={notificationCount > 0 ? notificationCount : null}>จัดการระบบ</NavLink>
              )}
              <button onClick={handleLogout} className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 text-base">ออกจากระบบ</button>
            </>
          ) : (
            <>
              <Link to="/register" className="bg-white text-purple-600 px-4 py-2 rounded-full hover:bg-purple-100 text-base">ลงทะเบียน</Link>
              <Link to="/login" className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 text-base">เข้าสู่ระบบ</Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile navbar */}
      <nav
        className={`md:hidden bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-0'
        } overflow-hidden h-screen fixed top-0 left-0 z-40`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-grow pt-16 px-4">
            <NavLink to="/" mobile>หน้าหลัก</NavLink>
            <NavLink to="/report" mobile>แจ้งของชำรุด</NavLink>
            <NavLink to="/dashboard" mobile>รายการทั้งหมด</NavLink>
            {isLoggedIn && user && user.role === 'admin' && (
              <NavLink to="/admin" mobile badge={notificationCount > 0 ? notificationCount : null}>จัดการระบบ</NavLink>
            )}
          </div>
          <div className="p-4 border-t border-gray-200">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
              >
                ออกจากระบบ
              </button>
            ) : (
              <div className="space-y-2">
                <Link to="/login" className="block w-full py-2 px-4 bg-purple-500 text-white rounded-md text-center hover:bg-purple-600 transition-colors duration-300">
                  เข้าสู่ระบบ
                </Link>
                <Link to="/register" className="block w-full py-2 px-4 bg-white text-purple-500 border border-purple-500 rounded-md text-center hover:bg-purple-100 transition-colors duration-300">
                  ลงทะเบียน
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;