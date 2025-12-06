import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentManagerPage = ({ currentUser }) => {
  const API_BASE_URL = 'http://localhost:8000/api/v1';
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  // Form chứa dữ liệu của cả NGUOI_DUNG và SINH_VIEN
  const [formData, setFormData] = useState({
    id: '',             // Ma (NGUOI_DUNG)
    fullName: '',       // Ho va ten
    email: '',          // Email
    username: '',       // Ten dang nhap
    password: '',       // Mat khau (Để tạo User mới)
    
    facultyId: 'MT',    // Ma khoa (SINH_VIEN)
    program: 'Chính quy', // Chuong trinh
    cohort: '2023',     // Nien khoa
    className: ''       // Lop
  });

  const canEdit = currentUser.role === 'ADMIN';

  const fetchStudents = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/students/search`, {});
      setStudents(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/students/create`, formData);
      alert("✅ Thêm sinh viên thành công!");
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.detail || "Lỗi server"));
    }
  };

  return (
    <div className="page-wrapper">
      <h2 className="header-title">Quản Lý Hồ Sơ Sinh Viên</h2>
      
      {/* Toolbar */}
      <div className="card toolbar">
        <div className="form-row" style={{marginBottom: 0}}>
           <div style={{flex: 1, fontWeight:'bold', paddingTop:'8px'}}>Danh sách Sinh viên</div>
           {canEdit && <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Thêm Hồ Sơ</button>}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>MSSV</th>
              <th>Họ Tên</th>
              <th>Email</th>
              <th>Lớp</th>
              <th>Chương Trình</th>
              <th>Niên Khóa</th>
            </tr>
          </thead>
          <tbody>
            {students.map(sv => (
              <tr key={sv.id}>
                <td><span className="badge-blue">{sv.id}</span></td>
                <td>{sv.fullName}</td>
                <td>{sv.email}</td>
                <td>{sv.className}</td>
                <td>{sv.program}</td>
                <td>{sv.cohort}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{width: '600px'}}>
            <h3>Thêm Sinh Viên Mới</h3>
            <form onSubmit={handleSubmit}>
              <h4 style={{borderBottom:'1px solid #eee'}}>1. Thông tin cá nhân (Bảng Người Dùng)</h4>
              <div className="form-row">
                 <div className="form-group">
                    <label>MSSV (*):</label>
                    <input className="input-control" required onChange={e => setFormData({...formData, id: e.target.value})} />
                 </div>
                 <div className="form-group">
                    <label>Họ Tên (*):</label>
                    <input className="input-control" required onChange={e => setFormData({...formData, fullName: e.target.value})} />
                 </div>
              </div>
              <div className="form-group">
                 <label>Email (*):</label>
                 <input className="input-control" required onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-row">
                 <div className="form-group">
                    <label>Username:</label>
                    <input className="input-control" required onChange={e => setFormData({...formData, username: e.target.value})} />
                 </div>
                 <div className="form-group">
                    <label>Password:</label>
                    <input className="input-control" type="password" required onChange={e => setFormData({...formData, password: e.target.value})} />
                 </div>
              </div>

              <h4 style={{borderBottom:'1px solid #eee', marginTop:'20px'}}>2. Thông tin học vụ (Bảng Sinh Viên)</h4>
              <div className="form-row">
                 <div className="form-group">
                    <label>Lớp Sinh Hoạt:</label>
                    <input className="input-control" placeholder="Lớp..." onChange={e => setFormData({...formData, className: e.target.value})} />
                 </div>
                 <div className="form-group">
                    <label>Mã Khoa:</label>
                    <input className="input-control" defaultValue="MT" onChange={e => setFormData({...formData, facultyId: e.target.value})} />
                 </div>
              </div>
              <div className="form-row">
                 <div className="form-group">
                    <label>Chương Trình:</label>
                    <input className="input-control" defaultValue="Chính quy" onChange={e => setFormData({...formData, program: e.target.value})} />
                 </div>
                 <div className="form-group">
                    <label>Niên Khóa:</label>
                    <input className="input-control" defaultValue="2023" onChange={e => setFormData({...formData, cohort: e.target.value})} />
                 </div>
              </div>

              <div className="actions">
                <button type="submit" className="btn btn-success">Lưu Hồ Sơ</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagerPage;