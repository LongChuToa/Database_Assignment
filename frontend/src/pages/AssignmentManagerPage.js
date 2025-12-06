// src/frontend/src/pages/AssignmentManagerPage.js
import React, { useState } from 'react';
import axios from 'axios';

const AssignmentManagerPage = ({ currentUser }) => {
  const API_BASE_URL = 'http://localhost:8000/api/v1';

  // --- STATE 1: BỘ LỌC LỚP HỌC (Context) ---
  const [selectedClass, setSelectedClass] = useState({
    semesterName: 'Học kỳ 1 Năm 2024-2025',
    subjectId: '',
    className: ''
  });

  // --- STATE 2: DANH SÁCH BÀI TẬP ---
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- STATE 3: FORM MODAL ---
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: '', name: '', description: '', format: 'Tự luận', 
    option: '', startDate: '', endDate: ''
  });

  // Quyền hạn
  const canEdit = currentUser.role === 'ADMIN' || currentUser.role === 'LECTURER';

  // 1. TẢI DANH SÁCH BÀI TẬP
  const fetchAssignments = async () => {
    if (!selectedClass.subjectId || !selectedClass.className) {
      return alert("Vui lòng nhập Mã môn và Tên lớp để tìm bài tập!");
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/assignments/search`, selectedClass);
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
      // Mock data nếu API lỗi
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  // 2. THÊM BÀI TẬP
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        semesterName: selectedClass.semesterName,
        subjectId: selectedClass.subjectId,
        className: selectedClass.className
      };

      await axios.post(`${API_BASE_URL}/assignments/create`, payload);
      alert("✅ Tạo bài tập thành công!");
      setShowModal(false);
      fetchAssignments(); 
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.detail || "Lỗi server"));
    }
  };

  // 3. XÓA BÀI TẬP
  const handleDelete = async (assignmentId) => {
    if(!window.confirm("Bạn chắc chắn muốn xóa bài tập này?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/assignments/delete`, {
        params: {
          semester: selectedClass.semesterName,
          subject: selectedClass.subjectId,
          classname: selectedClass.className,
          id: assignmentId
        }
      });
      fetchAssignments();
    } catch (err) {
      alert("Không thể xóa: " + err.response?.data?.detail);
    }
  };

  return (
    <div className="page-wrapper">
      <h2 className="header-title">Quản Lý Bài Tập (Assignments)</h2>

      {/* CHỌN LỚP HỌC */}
      <div className="card toolbar" style={{background: '#e3f2fd', border: '1px solid #90caf9'}}>
        <h4 style={{marginTop:0, marginBottom:'10px', color:'#0d47a1'}}>1. Chọn Lớp Học</h4>
        <div className="form-row" style={{marginBottom: 0, alignItems:'flex-end'}}>
          <div style={{flex: 1.5}}>
             <label>Học Kỳ:</label>
             <select className="input-control" value={selectedClass.semesterName} onChange={e => setSelectedClass({...selectedClass, semesterName: e.target.value})}>
                <option>Học kỳ 1 Năm 2024-2025</option>
                <option>Học kỳ 2 Năm 2024-2025</option>
             </select>
          </div>
          <div style={{flex: 1}}>
             <label>Mã Môn Học:</label>
             <input className="input-control" placeholder="VD: CO2013" value={selectedClass.subjectId} onChange={e => setSelectedClass({...selectedClass, subjectId: e.target.value})} />
          </div>
          <div style={{flex: 1}}>
             <label>Tên Lớp:</label>
             <input className="input-control" placeholder="VD: L01" value={selectedClass.className} onChange={e => setSelectedClass({...selectedClass, className: e.target.value})} />
          </div>
          <button className="btn btn-primary" onClick={fetchAssignments}>🔍 Xem Bài Tập</button>
        </div>
      </div>

      {/* DANH SÁCH BÀI TẬP */}
      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
            <h4 style={{margin:0}}>Danh sách Bài tập</h4>
            {canEdit && (
                <button className="btn btn-success" onClick={() => setShowModal(true)} disabled={!selectedClass.subjectId}>
                    + Thêm Bài Tập Mới
                </button>
            )}
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Mã Bài (ID)</th>
              <th>Tên Bài Tập</th>
              <th>Hình Thức</th>
              <th>Bắt Đầu</th>
              <th>Kết Thúc</th>
              {canEdit && <th>Thao Tác</th>}
            </tr>
          </thead>
          <tbody>
            {assignments.length > 0 ? assignments.map(asg => (
              <tr key={asg.id}>
                <td><span className="badge-blue">{asg.id}</span></td>
                <td style={{fontWeight:'bold'}}>{asg.name}</td>
                <td>{asg.format}</td>
                <td>{asg.startDate}</td>
                <td>{asg.endDate}</td>
                {canEdit && (
                  <td>
                    <button className="btn-sm btn-danger" onClick={() => handleDelete(asg.id)}>Xóa</button>
                  </td>
                )}
              </tr>
            )) : (
              <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>Chưa có dữ liệu.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Tạo Bài Tập Mới</h3>
            <p style={{fontSize:'12px', color:'#666'}}>
                Lớp: <strong>{selectedClass.className} ({selectedClass.subjectId})</strong>
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                 <div className="form-group">
                    <label>Mã Bài Tập (ID):</label>
                    <input className="input-control" required placeholder="BT01" onChange={e => setFormData({...formData, id: e.target.value})} />
                 </div>
                 <div className="form-group" style={{flex: 2}}>
                    <label>Tên Bài Tập:</label>
                    <input className="input-control" required onChange={e => setFormData({...formData, name: e.target.value})} />
                 </div>
              </div>
              
              <div className="form-group">
                 <label>Mô tả:</label>
                 <input className="input-control" onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="form-row">
                 <div className="form-group">
                    <label>Hình Thức:</label>
                    <select className="input-control" onChange={e => setFormData({...formData, format: e.target.value})}>
                        <option value="Tự luận">Tự luận</option>
                        <option value="Trắc nghiệm">Trắc nghiệm</option>
                    </select>
                 </div>
                 <div className="form-group">
                    <label>Tùy chọn:</label>
                    <input className="input-control" placeholder="VD: Nộp trễ" onChange={e => setFormData({...formData, option: e.target.value})} />
                 </div>
              </div>

              <div className="form-row">
                 <div className="form-group">
                    <label>Bắt đầu:</label>
                    <input type="datetime-local" className="input-control" required onChange={e => setFormData({...formData, startDate: e.target.value})} />
                 </div>
                 <div className="form-group">
                    <label>Kết thúc:</label>
                    <input type="datetime-local" className="input-control" required onChange={e => setFormData({...formData, endDate: e.target.value})} />
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

export default AssignmentManagerPage;