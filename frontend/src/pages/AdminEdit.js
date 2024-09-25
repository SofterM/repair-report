import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get(`/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReport(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching report:', error);
        setError('Failed to fetch report details. Please try again later.');
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, token]);

  const handleStatusChange = (status) => {
    setReport(prev => ({ ...prev, status }));
  };

  const handleNoteChange = (event) => {
    setReport(prev => ({ ...prev, note: event.target.value }));
  };

  const handleSave = async () => {
    try {
      await api.patch(`/reports/${id}`, {
        status: report.status,
        note: report.note
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating report:', error);
      setError('Failed to update report. Please try again later.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await api.delete(`/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting report:', error);
        setError('Failed to delete report. Please try again later.');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />; // Show loading spinner while loading
  }
  if (error) return <div>{error}</div>;
  if (!report) return <div>Report not found</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{background: 'linear-gradient(180deg, #A18CD1 0%, #FBC2EB 100%)'}}>
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-700 mb-6">รายละเอียดการแจ้ง</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-gray-600 mb-2">ชื่อ-สกุล</label>
            <input type="text" value={report.name} className="w-full p-3 border rounded-lg bg-gray-100" readOnly />
            <label className="block text-gray-600 mt-6 mb-2">รายละเอียด</label>
            <textarea className="w-full p-3 border rounded-lg bg-gray-100 h-40" readOnly value={report.details}></textarea>
          </div>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-2">อาคาร</label>
                <input type="text" value={report.building} className="w-full p-3 border rounded-lg bg-gray-100" readOnly />
              </div>
              <div>
                <label className="block text-gray-600 mb-2">เลขห้อง</label>
                <input type="text" value={report.roomNumber} className="w-full p-3 border rounded-lg bg-gray-100" readOnly />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-600 mb-2">หมวดหมู่</label>
                <input type="text" value={report.category} className="w-full p-3 border rounded-lg bg-gray-100" readOnly />
              </div>
              <div>
                <label className="block text-gray-600 mb-2">วันที่รายงาน</label>
                <div className="relative">
                  <input type="text" value={new Date(report.reportDate).toLocaleDateString('th-TH')} className="w-full p-3 border rounded-lg bg-gray-100" readOnly />
                  <i className="fas fa-calendar-alt absolute right-3 top-3 text-gray-500"></i>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-600 mb-2">เปลี่ยนสถานะ</label>
                <div className="space-y-2">
                  <div className="flex items-center border p-2 rounded-lg">
                    <span className="text-red-500 mr-2">รอดำเนินการ</span>
                    <input 
                      type="radio" 
                      name="status" 
                      checked={report.status === 'รอดำเนินการ'}
                      onChange={() => handleStatusChange('รอดำเนินการ')}
                      className="ml-auto" 
                    />
                  </div>
                  <div className="flex items-center border p-2 rounded-lg">
                    <span className="text-yellow-500 mr-2">กำลังดำเนินการ</span>
                    <input 
                      type="radio" 
                      name="status" 
                      checked={report.status === 'กำลังดำเนินการ'}
                      onChange={() => handleStatusChange('กำลังดำเนินการ')}
                      className="ml-auto" 
                    />
                  </div>
                  <div className="flex items-center border p-2 rounded-lg">
                    <span className="text-green-500 mr-2">เสร็จสิ้น</span>
                    <input 
                      type="radio" 
                      name="status" 
                      checked={report.status === 'เสร็จสิ้น'}
                      onChange={() => handleStatusChange('เสร็จสิ้น')}
                      className="ml-auto" 
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-gray-600 mb-2">เพิ่มหมายเหตุ</label>
                <textarea 
                  value={report.note} 
                  onChange={handleNoteChange}
                  className="w-full p-3 border rounded-lg bg-white" 
                  rows="4"
                />
              </div>
            </div>
          </div>
        </div>
        {report.imagePath && (
          <div className="mt-6">
            <label className="block text-gray-600 mb-2">รูปภาพ</label>
            <div 
              className="relative w-full h-64 overflow-hidden rounded-lg shadow-md cursor-pointer" 
              onClick={() => setSelectedImage(report.imagePath)}
            >
              <img 
                src={report.imagePath} 
                alt="Report" 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-lg font-semibold">Click to view full image</span>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end mt-8 space-x-4">
          <button onClick={handleDelete} className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-300">ลบรายการ</button>
          <button onClick={handleSave} className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300">บันทึก</button>
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

export default AdminEdit;