// src/frontend/src/pages/CRUDPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CRUDPage = () => {
  const API_BASE_URL = 'http://localhost:8000/api/v1';

  const [formData, setFormData] = useState({
    subjectId: '',
    classCode: '',
    semester: 'HK241',
    lecturerId: '',
    schedule: '',
    maxStudents: 50
  });

  const [subjects, setSubjects] = useState([]); // List môn học từ API
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load danh sách môn học khi vào trang
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/lists/subjects`);
        setSubjects(res.data);
      } catch (err) {
        console.error("Lỗi lấy môn học");
      }
    };
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: 'Đang xử lý...' });

    try {
      // Gọi API: POST /classes/create
      await axios.post(`${API_BASE_URL}/classes/create`, formData);
      
      setMessage({ 
        type: 'success', 
        text: `Thành công! Đã thêm lớp ${formData.classCode} vào CSDL.` 
      });
      
      // Reset form
      setFormData({...formData, classCode: '', schedule: ''});

    } catch (error) {
      // Lấy thông báo lỗi từ Backend (Chính là lỗi Trigger SQL ném ra)
      const errorMsg = error.response?.data?.detail || "Lỗi kết nối Server";
      setMessage({ 
        type: 'error', 
        text: `LỖI SQL: ${errorMsg}` 
      });
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="header-title">Thêm Mới Lớp Học (Câu 3.1)</h2>

      {message.text && (
        <div style={{
          padding: '15px', 
          marginBottom: '20px', 
          borderRadius: '4px',
          backgroundColor: message.type === 'error' ? '#f8d7da' : '#d4edda',
          color: message.type === 'error' ? '#721c24' : '#155724',
          border: `1px solid ${message.type === 'error' ? '#f5c6cb' : '#c3e6cb'}`
        }}>
          {message.type === 'error' ? '⚠️ ' : '✅ '} {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Môn Học (*):</label>
            <select name="subjectId" className="input-control" onChange={handleChange} value={formData.subjectId}>
              <option value="">-- Chọn Môn Học --</option>
              {subjects.length > 0 ? subjects.map(sub => (
                 <option key={sub.MaMH} value={sub.MaMH}>{sub.MaMH} - {sub.TenMH}</option>
              )) : (
                 <option value="CO2013">CO2013 - Hệ CSDL (Hardcode nếu API rỗng)</option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>Mã Lớp (*):</label>
            <input name="classCode" type="text" className="input-control" onChange={handleChange} value={formData.classCode} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Học Kỳ (*):</label>
            <select name="semester" className="input-control" onChange={handleChange} value={formData.semester}>
              <option value="HK241">HK1 / 2024-2025</option>
              <option value="HK242">HK2 / 2024-2025</option>
            </select>
          </div>
          <div className="form-group">
            <label>Giảng Viên ID (*):</label>
            <input name="lecturerId" type="text" className="input-control" placeholder="Nhập ID GV (vd: GV001)" onChange={handleChange} value={formData.lecturerId} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Lịch Học:</label>
            <input 
              name="schedule" type="text" className="input-control" 
              placeholder="Vd: Thứ 5, Tiết 6-9, Phòng H6-301" 
              onChange={handleChange} value={formData.schedule}
            />
          </div>
          <div className="form-group">
            <label>Sỉ số tối đa:</label>
            <input name="maxStudents" type="number" className="input-control" onChange={handleChange} value={formData.maxStudents} />
          </div>
        </div>

        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <button type="submit" className="btn btn-primary">Lưu Lớp Học</button>
        </div>
      </form>
    </div>
  );
};

export default CRUDPage;