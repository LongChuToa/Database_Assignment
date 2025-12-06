// src/frontend/src/pages/ClassManagerPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClassManagerPage = ({ currentUser }) => {
  const API_BASE_URL = 'http://localhost:8000/api/v1';

  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [classes, setClasses] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', semester: 'HK241' });
  
  // --- STATE CHO FORM (MODAL) ---
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    subjectId: 'CO2013', classCode: '', semester: 'HK241', 
    lecturerId: '', schedule: '', maxStudents: 50
  });
  const [message, setMessage] = useState(null);

  // --- LOGIC PHÂN QUYỀN (QUAN TRỌNG) ---
  // Quyền Sửa/Thêm: Admin hoặc Giảng viên
  const canEdit = currentUser.role === 'ADMIN' || currentUser.role === 'LECTURER';
  // Quyền Xóa: Chỉ Admin
  const canDelete = currentUser.role === 'ADMIN';

  // --- 1. TẢI DỮ LIỆU ---
  const fetchClasses = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/classes/search`, filters);
      setClasses(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchClasses(); }, [filters]);

  // --- 2. XỬ LÝ THÊM LỚP ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await axios.post(`${API_BASE_URL}/classes/create`, formData);
      alert("✅ Thêm lớp học thành công!");
      setShowModal(false);
      fetchClasses(); 
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Lỗi Server";
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  // --- 3. XỬ LÝ XÓA LỚP ---
  const handleDelete = async (id, code) => {
    if(!window.confirm(`Xóa lớp ${code}?`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/classes/${id}`);
      fetchClasses();
    } catch (err) { alert("Không thể xóa: " + err.response?.data?.detail); }
  };

  return (
    <div className="page-wrapper">
      <h2 className="header-title">
        {currentUser.role === 'STUDENT' ? 'Thời Khóa Biểu / Lớp Đã Đăng Ký' : 'Quản Lý Lớp Học'}
      </h2>

      {/* THANH CÔNG CỤ TÌM KIẾM */}
      <div className="card toolbar">
        <div className="form-row" style={{marginBottom: 0}}>
          <div style={{flex: 2}}>
            <input 
              className="input-control" placeholder="🔍 Tìm theo tên môn học..."
              value={filters.keyword}
              onChange={e => setFilters({...filters, keyword: e.target.value})}
            />
          </div>
          <div style={{flex: 1}}>
            <select 
              className="input-control" 
              value={filters.semester}
              onChange={e => setFilters({...filters, semester: e.target.value})}
            >
              <option value="HK241">Học kỳ 1 / 2024-2025</option>
              <option value="HK242">Học kỳ 2 / 2024-2025</option>
            </select>
          </div>
          
          {/* PHÂN QUYỀN NÚT THÊM: Chỉ hiện với Admin/GV */}
          {canEdit && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              + Mở Lớp Mới
            </button>
          )}
        </div>
      </div>

      {/* DANH SÁCH LỚP HỌC */}
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã Lớp</th>
              <th>Môn Học</th>
              <th>Giảng Viên</th>
              <th>Lịch Học</th>
              <th>Sĩ Số</th>
              {/* Cột Thao tác chỉ hiện với người có quyền */}
              {canEdit && <th>Thao Tác</th>}
            </tr>
          </thead>
          <tbody>
            {classes.map(cls => (
              <tr key={cls.id}>
                <td><span className="badge-blue">{cls.classCode}</span></td>
                <td>{cls.subjectName} <br/><small style={{color:'#777'}}>{cls.subjectId}</small></td>
                <td>{cls.lecturerName}</td>
                <td>{cls.schedule}</td>
                <td>{cls.currentStudents}/{cls.maxStudents}</td>
                
                {/* Logic hiển thị nút bấm trong bảng */}
                {canEdit && (
                  <td>
                    {canDelete ? (
                      <button className="btn-sm btn-danger" onClick={() => handleDelete(cls.id, cls.classCode)}>
                        Xóa
                      </button>
                    ) : (
                      // Giảng viên thấy cột này nhưng không có nút xóa
                      <span style={{color: '#999', fontSize: '12px', fontStyle: 'italic'}}>Chỉ xem</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL THÊM LỚP (Chỉ hiện khi bấm nút Thêm) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Mở Lớp Học Mới</h3>
            {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Môn Học:</label>
                <select className="input-control" onChange={e => setFormData({...formData, subjectId: e.target.value})}>
                  <option value="CO2013">CO2013 - Hệ cơ sở dữ liệu</option>
                  <option value="CO3001">CO3001 - Công nghệ phần mềm</option>
                  <option value="CO3093">CO3093 - Mạng máy tính</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Mã Lớp (VD: L01):</label>
                  <input className="input-control" required onChange={e => setFormData({...formData, classCode: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Mã Giảng Viên:</label>
                  <input className="input-control" required placeholder="GV..." onChange={e => setFormData({...formData, lecturerId: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Lịch Học (Thứ, Tiết):</label>
                <input 
                  className="input-control" 
                  placeholder="VD: Thứ 5, Tiết 6-9" 
                  required 
                  onChange={e => setFormData({...formData, schedule: e.target.value})} 
                />
              </div>
              <div className="actions">
                <button type="submit" className="btn btn-success">Lưu (Gọi SP)</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Đóng</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagerPage;