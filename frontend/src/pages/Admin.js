import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import io from 'socket.io-client';
import Navbar from '../components/Navbar';

const Admin = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState({});
  const [newNotifications, setNewNotifications] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      const response = await api.get('/reports');
      setReports(response.data);
      const initialNotes = {};
      response.data.forEach(report => {
        initialNotes[report._id] = report.note || '';
      });
      setNotes(initialNotes);
    } catch (error) {
      setError('Failed to fetch reports');
    }
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-white relative overflow-hidden">
      <Navbar notificationCount={newNotifications} />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="absolute top-0 left-0 w-32 h-32 text-white opacity-50" viewBox="0 0 100 100">
          <path d="M50 5 A45 45 0 0 1 95 50 A45 45 0 0 1 50 95 A45 45 0 0 1 5 50 A45 45 0 0 1 50 5" fill="currentColor" />
        </svg>
        <svg className="absolute top-1/4 right-0 w-40 h-40 text-white opacity-50" viewBox="0 0 100 100">
          <path d="M50 5 A45 45 0 0 1 95 50 A45 45 0 0 1 50 95 A45 45 0 0 1 5 50 A45 45 0 0 1 50 5" fill="currentColor" />
        </svg>
        <svg className="absolute bottom-0 left-1/4 w-36 h-36 text-white opacity-50" viewBox="0 0 100 100">
          <path d="M50 5 A45 45 0 0 1 95 50 A45 45 0 0 1 50 95 A45 45 0 0 1 5 50 A45 45 0 0 1 50 5" fill="currentColor" />
        </svg>
      </div>
      <div className="relative z-10 container mx-auto mt-10 p-4">
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <ul className="space-y-8">
            {reports.map((report) => (
              <li key={report._id} className="border p-6 rounded-lg shadow-md bg-white">
                <h4 className="text-xl font-bold mb-2">{report.title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <p className="mt-1">{report.details}</p>
                        {report.note && (
                          <div className="mt-2 bg-yellow-50 p-2 rounded">
                            <p><strong>หมายเหตุ:</strong> {report.note}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex items-start space-x-2">
                      <select 
                        value={report.status}
                        onChange={(e) => updateReport(report._id, e.target.value)}
                        className="p-2 border rounded"
                      >
                        <option value="รอดำเนินการ">รอดำเนินการ</option>
                        <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                        <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                      </select>
                      <textarea
                        value={notes[report._id] || ''}
                        onChange={(e) => handleNoteChange(report._id, e.target.value)}
                        placeholder="เพิ่มหมายเหตุ..."
                        className="p-2 border rounded flex-grow"
                        rows="1"
                      />
                    </div>
                    <div className="mt-2">
                      <button 
                        onClick={() => saveNote(report._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                      >
                        บันทึกหมายเหตุ
                      </button>
                      <button 
                        onClick={() => deleteReport(report._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        ลบรายการ
                      </button>
                    </div>
                  </div>
                  <div>
                    {report.imagePath && (
                      <div 
                        className="relative w-full h-64 overflow-hidden rounded-lg shadow-md cursor-pointer" 
                        onClick={() => setSelectedImage(`http://localhost:5000/${report.imagePath}`)}
                      >
                        <img 
                          src={`http://localhost:5000/${report.imagePath}`} 
                          alt="Report" 
                          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white text-lg font-semibold">Click to view full image</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
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
    </div>
  );
};

export default Admin;