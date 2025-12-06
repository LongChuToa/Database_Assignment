import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClassManagerPage = ({ currentUser }) => {
  const API_BASE_URL = 'http://localhost:8000/api/v1';

  // State hiển thị
  const [classes, setClasses] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', semester: 'Học kỳ 1 Năm 2024-2025' });

  // State Form (Khớp với cột trong bảng LOP_HOC)
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    semesterName: 'Học kỳ 1 Năm 2024-2025', // PK1: Ten hoc ki
    subjectId: 'CO2013',                     // PK2: Ma mon hoc
    className: '',                           // PK3: Ten lop
    lecturerId: '',                          // FK: Ma giang vien
    time: '',                                // Thoi gian
    location: ''                             // Dia diem
  });
  
  const canEdit = currentUser.role === 'ADMIN' || currentUser.role === 'LECTURER';
  const canDelete = currentUser.role === 'ADMIN';

  // 1. Load danh sách lớp
  const fetchClasses = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/classes/search`, filters);
      setClasses(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchClasses(); }, [filters]);

  // 2. Thêm Lớp (INSERT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gửi đủ bộ 3 khóa chính + thông tin khác
      await axios.post(`${API_BASE_URL}/classes/create`, formData);
      alert("✅ Mở lớp thành công!");
      setShowModal(false);
      fetchClasses();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.detail || "Không thể tạo lớp"));
    }
  };

  // 3. Xóa Lớp (DELETE) - Phải gửi 3 khóa chính
  const handleDelete = async (semester, subject, name) => {
    if(!window.confirm(`Xóa lớp ${name} - ${subject} (${semester})?`)) return;
    try {
      // Dùng params để gửi 3 khóa chính qua URL
      await axios.delete(`${API_BASE_URL}/classes/delete`, {
        params: { 
          semesterName: semester, 
          subjectId: subject, 
          className: name 
        }
      });
      fetchClasses();
    } catch (err) {
      alert("Lỗi xóa: " + (err.response?.data?.detail || "Ràng buộc dữ liệu"));
    }
  };

  return (
    <div className="page-wrapper">
      <h2 className="header-title">Quản Lý Lớp Học (Theo Mapping DB)</h2>

      {/* Toolbar */}
      <div className="card toolbar">
        <div className="form-row" style={{marginBottom: 0}}>
          <div style={{flex: 2}}>
            <input className="input-control" placeholder="Tìm kiếm môn học..." 
                   value={filters.keyword} onChange={e => setFilters({...filters, keyword: e.target.value})} />
          </div>
          <div style={{flex: 1}}>
            <select className="input-control" value={filters.semester} onChange={e => setFilters({...filters, semester: e.target.value})}>
              <option value="Học kỳ 1 Năm 2024-2025">HK1 2024-2025</option>
              <option value="Học kỳ 2 Năm 2024-2025">HK2 2024-2025</option>
            </select>
          </div>
          {canEdit && <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Mở Lớp</button>}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Học Kỳ (PK)</th>
              <th>Môn Học (PK)</th>
              <th>Tên Lớp (PK)</th>
              <th>Giảng Viên</th>
              <th>Thời Gian</th>
              <th>Địa Điểm</th>
              {canEdit && <th>Thao Tác</th>}
            </tr>
          </thead>
          <tbody>
            {classes.map((cls, idx) => (
              <tr key={idx}>
                <td>{cls.semesterName}</td>
                <td><span className="badge-blue">{cls.subjectId}</span></td>
                <td style={{fontWeight:'bold'}}>{cls.className}</td>
                <td>{cls.lecturerId}</td>
                <td>{cls.time}</td>
                <td>{cls.location}</td>
                {canEdit && (
                  <td>
                    {canDelete && (
                      <button className="btn-sm btn-danger" 
                        onClick={() => handleDelete(cls.semesterName, cls.subjectId, cls.className)}>
                        Xóa
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Mở Lớp Mới</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Học Kỳ:</label>
                <input className="input-control" value={formData.semesterName} disabled />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Mã Môn Học (*):</label>
                  <input className="input-control" required placeholder="VD: CO2013"
                    onChange={e => setFormData({...formData, subjectId: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Tên Lớp (*):</label>
                  <input className="input-control" required placeholder="VD: L01"
                    onChange={e => setFormData({...formData, className: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Mã Giảng Viên (*):</label>
                <input className="input-control" required placeholder="VD: GV001"
                  onChange={e => setFormData({...formData, lecturerId: e.target.value})} />
              </div>
              <div className="form-row">
                 <div className="form-group">
                    <label>Thời Gian:</label>
                    <input className="input-control" onChange={e => setFormData({...formData, time: e.target.value})} />
                 </div>
                 <div className="form-group">
                    <label>Địa Điểm:</label>
                    <input className="input-control" onChange={e => setFormData({...formData, location: e.target.value})} />
                 </div>
              </div>
              <div className="actions">
                <button type="submit" className="btn btn-success">Lưu</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagerPage;