import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import io from 'socket.io-client';

const ITEMS_PER_PAGE = 5;

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userReports, setUserReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const [statusFilter, setStatusFilter] = useState('');
  const [showMenu, setShowMenu] = useState(null);
  const [userReportsPage, setUserReportsPage] = useState(1);
  const [allReportsPage, setAllReportsPage] = useState(1);

  const getCategoryFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get('category') || '';
  };

  const [categoryFilter, setCategoryFilter] = useState(getCategoryFromURL());

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const reports = response.data;
      setUserReports(reports.filter(report => report.createdBy === user._id));
      setAllReports(reports.filter(report => report.createdBy !== user._id));
      setError('');
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to fetch reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [token, user._id]);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    fetchReports();

    socket.on('newReport', fetchReports);
    socket.on('updateReport', fetchReports);
    socket.on('deleteReport', fetchReports);

    return () => socket.disconnect();
  }, [fetchReports]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (categoryFilter) {
      params.set('category', categoryFilter);
    } else {
      params.delete('category');
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [categoryFilter, location.pathname, location.search, navigate]);

  const deleteReport = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบรายงานนี้?')) {
      try {
        await api.delete(`/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchReports();
        setShowMenu(null);
        setError('');
      } catch (error) {
        console.error('Error deleting report:', error);
        setError('เกิดข้อผิดพลาดในการลบรายงาน โปรดลองอีกครั้งในภายหลัง');
      }
    }
  };

  const editReport = (id) => {
    navigate(`/edit-report/${id}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  const getUsernameFromEmail = (email) => {
    return email.split('@')[0];
  };

  const filterReports = (reports) => {
    return reports.filter(report => 
      (!categoryFilter || report.category === categoryFilter) &&
      (!statusFilter || report.status === statusFilter)
    );
  };

  const paginateReports = (reports, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return reports.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const renderPagination = (reports, currentPage, setPage) => {
    const pageCount = Math.ceil(reports.length / ITEMS_PER_PAGE);
    if (pageCount <= 1) return null;

    return (
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-purple-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="px-4 py-2 mx-1 bg-gray-200 rounded">
          {currentPage} / {pageCount}
        </span>
        <button
          onClick={() => setPage(prev => Math.min(prev + 1, pageCount))}
          disabled={currentPage === pageCount}
          className="px-4 py-2 mx-1 bg-purple-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    );
  };

  const renderReportList = (reports, title, currentPage, setPage, isUserReports) => {
    const filteredReports = filterReports(reports);
    const paginatedReports = paginateReports(filteredReports, currentPage);

    return (
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        {filteredReports.length === 0 ? (
          <p>ไม่มีรายการแจ้งซ่อมในขณะนี้</p>
        ) : (
          <>
            <ul className="space-y-4">
              {paginatedReports.map((report) => (
                <li key={report._id} className="border rounded-2xl shadow bg-white relative overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-lg">{report.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-full">
                          {formatDate(report.reportDate)}
                        </span>
                        {isUserReports && (
                          <div className="relative">
                            <button
                              onClick={() => setShowMenu(showMenu === report._id ? null : report._id)}
                              className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>
                            {showMenu === report._id && (
                              <div className="absolute top-10 right-0 bg-white p-2 shadow rounded-lg z-10">
                                <button
                                  onClick={() => editReport(report._id)}
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded whitespace-nowrap"
                                >
                                  แก้ไขรายงาน
                                </button>
                                <button
                                  onClick={() => deleteReport(report._id)}
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-red-500 rounded whitespace-nowrap"
                                >
                                  ลบรายงาน
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><strong>อาคาร:</strong> {report.building}</p>
                        <p><strong>เลขห้อง:</strong> {report.roomNumber}</p>
                        <p><strong>หมวดหมู่:</strong> {report.category}</p>
                        {report.note && (
                          <div className="mt-1">
                            <p className="font-semibold">หมายเหตุ:</p>
                            <p className="bg-yellow-50 p-2 rounded mt-2">{report.note}</p>
                          </div>
                        )}
                      </div>
                      <div className="h-32 overflow-hidden">
                        <p className="font-semibold mb-1">รายละเอียด:</p>
                        <div className="h-24 overflow-y-auto pr-2">
                          <p className="break-words text-gray-500">{report.details}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative h-10 mt-2 mx-6 mb-4">
                    <div className={`absolute bottom-4 left-0 right-0 h-2 rounded-full bg-gray-200`}>
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full ${
                          report.status === 'รอดำเนินการ' ? 'bg-red-500 w-1/3' :
                          report.status === 'กำลังดำเนินการ' ? 'bg-yellow-500 w-2/3' :
                          'bg-green-500 w-full'
                        }`}
                      ></div>
                    </div>
                    <div className={`absolute bottom-8 left-0 flex items-center text-sm font-semibold ${
                      report.status === 'รอดำเนินการ' ? 'text-red-600' :
                      report.status === 'กำลังดำเนินการ' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {report.status}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {renderPagination(filteredReports, currentPage, setPage)}
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center mt-8">กำลังโหลด...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-white relative overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* SVG background elements */}
      </div>
      <div className="relative z-10 container mx-auto mt-10 p-4">
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-2xl font-bold mb-4 md:mb-0">แดชบอร์ด</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center">
                <span className="mr-2 text-base font-medium">หมวดหมู่:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="p-2 border rounded-full text-base"
                >
                  <option value="">ทั้งหมด</option>
                  <option value="ไมค์โครโฟน">ไมค์โครโฟน</option>
                  <option value="อินเตอร์เน็ต">อินเตอร์เน็ต</option>
                  <option value="โปรเจคเตอร์">โปรเจคเตอร์</option>
                  <option value="จอแสดงภาพ">จอแสดงภาพ</option>
                  <option value="ลำโพง">ลำโพง</option>
                  <option value="เครื่องปรับอากาศ">เครื่องปรับอากาศ</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-base font-medium">สถานะ:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 border rounded-full text-base"
                >
                  <option value="">ทั้งหมด</option>
                  <option value="รอดำเนินการ">รอดำเนินการ</option>
                  <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                  <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                  </select>
              </div>
            </div>
          </div>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {user && user.email && (
            <p className="mb-4">
              รหัสนักศึกษาของคุณคือ {getUsernameFromEmail(user.email)}!
            </p>
          )}

          {renderReportList(userReports, "รายการแจ้งซ่อมของคุณ", userReportsPage, setUserReportsPage, true)}
          {renderReportList(allReports, "รายการแจ้งซ่อมทั้งหมด", allReportsPage, setAllReportsPage, false)}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;