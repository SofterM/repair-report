import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import io from 'socket.io-client';
import Navbar from '../components/Navbar';

const ITEMS_PER_PAGE = 5;

const Admin = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState({});
  const [newNotifications, setNewNotifications] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });

  const fetchReports = useCallback(async () => {
    try {
      const response = await api.get('/reports');
      setReports(response.data);
      const initialNotes = {};
      response.data.forEach(report => {
        initialNotes[report._id] = report.note || '';
      });
      setNotes(initialNotes);
      updateStats(response.data);
    } catch (error) {
      setError('Failed to fetch reports');
    }
  }, []);

  const updateStats = (reportData) => {
    const newStats = {
      total: reportData.length,
      pending: reportData.filter(r => r.status === 'รอดำเนินการ').length,
      inProgress: reportData.filter(r => r.status === 'กำลังดำเนินการ').length,
      completed: reportData.filter(r => r.status === 'เสร็จสิ้น').length
    };
    setStats(newStats);
  };

  const handleNewReport = useCallback(() => {
    fetchReports();
    setNewNotifications(prev => prev + 1);
  }, [fetchReports]);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    fetchReports();

    socket.on('newReport', handleNewReport);
    socket.on('updateReport', fetchReports);
    socket.on('deleteReport', fetchReports);

    return () => socket.disconnect();
  }, [fetchReports, handleNewReport]);

  const updateReport = async (id, status) => {
    try {
      await api.patch(`/reports/${id}`, { status, note: notes[id] });
      fetchReports();
      setNewNotifications(0);
    } catch (error) {
      setError('Failed to update report');
    }
  };

  const deleteReport = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await api.delete(`/reports/${id}`);
        fetchReports();
        setNewNotifications(0);
      } catch (error) {
        setError('Failed to delete report');
      }
    }
  };

  const handleNoteChange = (id, value) => {
    setNotes(prevNotes => ({
      ...prevNotes,
      [id]: value
    }));
  };

  const saveNote = async (id) => {
    try {
      await api.patch(`/reports/${id}`, { note: notes[id] });
      alert('Note saved successfully');
    } catch (error) {
      setError('Failed to save note');
    }
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const filteredReports = reports.filter(report => 
    filterStatus === 'all' || report.status === filterStatus
  );

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 relative overflow-hidden">
      <Navbar notificationCount={newNotifications} />
      <div className="relative z-10 container mx-auto mt-16 p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 sm:mb-8">Admin Dashboard</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10">
            <StatCard 
              title="รายงานทั้งหมด" 
              value={stats.total} 
              color="bg-gradient-to-br from-blue-300 to-blue-600"
              onClick={() => handleStatusFilter('all')}
              active={filterStatus === 'all'}
            />
            <StatCard 
              title="รอดำเนินการ" 
              value={stats.pending} 
              color="bg-gradient-to-br from-red-300 to-red-600"
              onClick={() => handleStatusFilter('รอดำเนินการ')}
              active={filterStatus === 'รอดำเนินการ'}
            />
            <StatCard 
              title="กำลังดำเนินการ" 
              value={stats.inProgress} 
              color="bg-gradient-to-br from-yellow-300 to-yellow-600"
              onClick={() => handleStatusFilter('กำลังดำเนินการ')}
              active={filterStatus === 'กำลังดำเนินการ'}
            />
            <StatCard 
              title="เสร็จสิ้น" 
              value={stats.completed} 
              color="bg-gradient-to-br from-green-300 to-green-600"
              onClick={() => handleStatusFilter('เสร็จสิ้น')}
              active={filterStatus === 'เสร็จสิ้น'}
            />
          </div>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}
          <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              {filterStatus === 'all' ? 'รายงานทั้งหมด' : `รายงานสถานะ: ${filterStatus}`}
            </h3>
            <ul className="space-y-4 sm:space-y-6">
              {paginatedReports.map((report) => (
                <li key={report._id} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 transition-all duration-300 hover:shadow-md">
                  <h4 className="text-lg font-semibold mb-2">{report.title}</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p><strong>ชื่อผู้แจ้ง:</strong> {report.name}</p>
                          <p><strong>อาคาร:</strong> {report.building}</p>
                          <p><strong>เลขห้อง:</strong> {report.roomNumber}</p>
                          <p><strong>หมวดหมู่:</strong> {report.category}</p>
                          <p><strong>วันที่รายงาน:</strong> {new Date(report.reportDate).toLocaleDateString('th-TH')}</p>
                          <p><strong>สถานะ:</strong> {report.status}</p>
                        </div>
                        <div>
                          <p><strong>รายละเอียด:</strong></p>
                          <div 
                            className="mt-1 h-24 sm:h-32 overflow-y-auto pr-2 cursor-pointer"
                            onClick={() => setSelectedDetails(report.details)}
                          >
                            <p className="whitespace-pre-wrap break-words">{report.details}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-2">
                        <select 
                          value={report.status}
                          onChange={(e) => updateReport(report._id, e.target.value)}
                          className="p-2 border rounded w-full sm:w-auto"
                        >
                          <option value="รอดำเนินการ">รอดำเนินการ</option>
                          <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                          <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                        </select>
                        <textarea
                          value={notes[report._id] || ''}
                          onChange={(e) => handleNoteChange(report._id, e.target.value)}
                          placeholder="เพิ่มหมายเหตุ..."
                          className="p-2 border rounded w-full sm:flex-grow"
                          rows="1"
                        />
                      </div>
                      <div className="mt-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button 
                          onClick={() => saveNote(report._id)}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full sm:w-auto"
                        >
                          บันทึกหมายเหตุ
                        </button>
                        <button 
                          onClick={() => deleteReport(report._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full sm:w-auto"
                        >
                          ลบรายการ
                        </button>
                      </div>
                    </div>
                    <div>
                      {report.imagePath && (
                        <div 
                          className="relative w-full h-48 sm:h-64 overflow-hidden rounded-lg shadow-md cursor-pointer mt-4 lg:mt-0" 
                          onClick={() => setSelectedImage(report.imagePath)}
                        >
                          <img 
                            src={report.imagePath} 
                            alt="Report" 
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white text-sm sm:text-lg font-semibold">Click to view full image</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 flex justify-center flex-wrap">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-purple-500 text-white rounded-l-md disabled:bg-gray-300 mb-2 sm:mb-0"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-gray-200 mb-2 sm:mb-0">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-purple-500 text-white rounded-r-md disabled:bg-gray-300 mb-2 sm:mb-0"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" 
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full p-4 relative">
            <img 
              src={selectedImage} 
              alt="Full size" 
              className="max-w-full max-h-[calc(100vh-2rem)] object-contain"
            />
            <button 
              className="absolute top-2 right-2 text-white text-2xl font-bold bg-black bg-opacity-50 w-8 h-8 rounded-full flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}
      {selectedDetails && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" 
          onClick={() => setSelectedDetails(null)}
        >
          <div className="bg-white p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto relative m-4">
            <h3 className="text-xl font-bold mb-4">รายละเอียดทั้งหมด</h3>
            <p className="whitespace-pre-wrap break-words">{selectedDetails}</p>
            <button 
              className="absolute top-2 right-2 text-gray-600 text-2xl font-bold hover:text-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDetails(null);
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, color, onClick, active }) => (
  <div 
    className={`${color} p-4 sm:p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer ${
      active ? 'ring-4 ring-offset-2 ring-gray-300' : ''
    }`}
    onClick={onClick}
  >
    <h3 className="text-base sm:text-lg font-medium mb-2 text-white">{title}</h3>
    <p className="text-2xl sm:text-4xl font-bold text-white">{value}</p>
  </div>
);

export default Admin;