import React, { useState, useRef, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const buildings = ['UB', 'CE', 'ICT', 'PKY'];
const categories = [
  'ไมค์โครโฟน',
  'อินเตอร์เน็ต',
  'โปรเจคเตอร์',
  'จอแสดงภาพ',
  'ลำโพง',
  'เครื่องปรับอากาศ',
  'อื่นๆ'
];

const EditReportForm = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    building: '',
    roomNumber: '',
    details: '',
    category: '',
    reportDate: new Date().toISOString().split('T')[0],
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get(`/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const reportData = response.data;
        setFormData({
          name: reportData.name,
          building: reportData.building,
          roomNumber: reportData.roomNumber,
          details: reportData.details,
          category: reportData.category,
          reportDate: reportData.reportDate.split('T')[0],
        });
        if (reportData.imagePath) {
          setPreviewUrl(`http://localhost:5000/${reportData.imagePath}`);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching report:', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
          toast.error(`Failed to load report data: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
          toast.error('No response received from server. Please try again.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
          toast.error('An error occurred while fetching the report.');
        }
        navigate('/dashboard');
      }
    };

    fetchReport();
  }, [id, navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'กรุณากรอกชื่อ-สกุล';
    if (!formData.building) newErrors.building = 'กรุณาเลือกอาคาร';
    if (!formData.roomNumber.trim()) newErrors.roomNumber = 'กรุณากรอกเลขห้อง';
    if (!formData.details.trim()) newErrors.details = 'กรุณากรอกรายละเอียด';
    if (!formData.category) newErrors.category = 'กรุณาเลือกหมวดหมู่';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    if (image) {
      formDataToSend.append('image', image);
    }

    try {
      await api.patch(`/reports/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('รายงานถูกอัปเดตเรียบร้อยแล้ว');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('เกิดข้อผิดพลาดในการอัปเดตรายงาน');
    }
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
      <div className="relative z-10 flex items-center justify-center p-4">
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg w-full max-w-4xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">แก้ไขรายงาน</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-สกุล</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">อาคาร</label>
                <select
                  id="building"
                  name="building"
                  value={formData.building}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.building ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">เลือกอาคาร</option>
                  {buildings.map(building => (
                    <option key={building} value={building}>{building}</option>
                  ))}
                </select>
                {errors.building && <p className="text-red-500 text-sm mt-1">{errors.building}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">เลขห้อง</label>
                <input
                  type="text"
                  id="roomNumber"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.roomNumber ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.roomNumber && <p className="text-red-500 text-sm mt-1">{errors.roomNumber}</p>}
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">เลือกหมวดหมู่</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
              <textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows={4}
                className={`w-full p-2 border rounded-md ${errors.details ? 'border-red-500' : 'border-gray-300'}`}
              ></textarea>
              {errors.details && <p className="text-red-500 text-sm mt-1">{errors.details}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">แนบรูปภาพที่ต้องการรายงาน</label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                />
                {previewUrl ? (
                  <div className="mt-2 relative">
                    <img src={previewUrl} alt="Preview" className="max-w-full h-auto max-h-48 mx-auto" />
                    <button
                      type="button"
                      onClick={handleImageDelete}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label htmlFor="image" className="cursor-pointer flex flex-col items-center justify-center h-32">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-blue-500">Click to browse</span> or drop here
                  </label>
                )}
              </div>
              {image && (
                <div className="mt-2 text-sm text-gray-600">
                  ชื่อไฟล์: {image.name} (ขนาด: {formatFileSize(image.size)})
                </div>
              )}
            </div>

            <div>
              <label htmlFor="reportDate" className="block text-sm font-medium text-gray-700 mb-1">วันที่รายงาน</label>
              <input
                type="date"
                id="reportDate"
                name="reportDate"
                value={formData.reportDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-md border-gray-300"
              />
            </div>
            <div className="flex space-x-24">
            <button 
                type="button" 
                onClick={handleCancel}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                ยกเลิก
              </button>
            <button 
                type="submit" 
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                บันทึกการแก้ไข
              </button>
              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditReportForm