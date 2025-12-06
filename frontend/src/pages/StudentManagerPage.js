import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentManagerPage = ({ currentUser }) => {
  const API_BASE_URL = 'http://localhost:8000/api/v1';

  // --- STATE DỮ LIỆU ---
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', faculty: 'Khoa KH&KT Máy Tính' });
  const [loading, setLoading] = useState(false);

  // --- STATE FORM (MODAL) ---
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: '',             // MSSV (Khóa chính)
    name: '',           // Họ tên
    email: '',          // Email trường (Unique)
    dob: '',            // Ngày sinh
    facultyId: 'MT',    // Mã Khoa
    program: 'Chính quy', // Chương trình học
    cohort: '2023'      // Niên khóa
  });
  const [message, setMessage] = useState(null);

  // --- PHÂN QUYỀN ---
  const canEdit = currentUser.role === 'ADMIN'; // Chỉ Admin mới được Thêm/Xóa
  
  // 1. TẢI DANH SÁCH SINH VIÊN
  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Gọi API tìm kiếm (Backend cần implement SQL SELECT JOIN NGUOI_DUNG & SINH_VIEN)
      const res = await axios.post(`${API_BASE_URL}/students/search`, filters);
      setStudents(res.data);
    } catch (err) {
      console.error("Lỗi tải SV:", err);
      // Mock data nếu API chưa chạy để bạn test giao diện
      setStudents([
        { id: '2310001', name: 'Nguyễn Văn An', email: 'an.nguyen@hcmut.edu.vn', faculty: 'KH&KT Máy Tính', program: 'Chính quy', status: 'Đang học' },
        { id: '2310002', name: 'Lê Thị Bích', email: 'bich.le@hcmut.edu.vn', faculty: 'KH&KT Máy Tính', program: 'CLC', status: 'Đang học' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, [filters]);

  // 2. XỬ LÝ THÊM SINH VIÊN (INSERT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      // Validate dữ liệu cơ bản
      if (!formData.email.endsWith('@hcmut.edu.vn')) {
        setMessage({ type: 'error', text: 'Email phải có đuôi @hcmut.edu.vn (Ràng buộc ngữ nghĩa)' });
        return;
      }

      // Gọi API Create
      await axios.post(`${API_BASE_URL}/students/create`, formData);
      alert("✅ Thêm hồ sơ sinh viên thành công!");
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Lỗi Server (Kiểm tra trùng MSSV/Email)";
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  // 3. XỬ LÝ XÓA SINH VIÊN (DELETE)
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Cảnh báo: Bạn có chắc muốn xóa sinh viên ${name} (${id})?\nHành động này có thể bị chặn nếu SV đã có điểm.`)) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/students/${id}`);
      fetchStudents();
    } catch (err) {
      alert("❌ Không thể xóa: " + (err.response?.data?.detail || "Lỗi ràng buộc dữ liệu"));
    }
  };

  return (
    <div className="page-wrapper">
      <h2 className="header-title">Quản Lý Hồ Sơ Sinh Viên</h2>

      {/* THANH CÔNG CỤ (TOOLBAR) */}
      <div className="card toolbar">
        <div className="form-row" style={{marginBottom: 0}}>
          <div style={{flex: 2}}>
            <input 
              className="input-control" 
              placeholder="🔍 Tìm kiếm MSSV hoặc Họ tên..."
              value={filters.keyword}
              onChange={e => setFilters({...filters, keyword: e.target.value})}
            />
          </div>
          <div style={{flex: 1}}>
            <select 
              className="input-control" 
              value={filters.faculty}
              onChange={e => setFilters({...filters, faculty: e.target.value})}
            >
              <option value="Khoa KH&KT Máy Tính">Khoa KH&KT Máy Tính</option>
              <option value="Khoa Điện - Điện Tử">Khoa Điện - Điện Tử</option>
            </select>
          </div>
          
          {/* Chỉ Admin thấy nút Thêm */}
          {canEdit && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              + Thêm Sinh Viên
            </button>
          )}
        </div>
      </div>

      {/* DANH SÁCH SINH VIÊN */}
      <div className="card">
        {loading ? <p>Đang tải dữ liệu...</p> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>MSSV</th>
                <th>Họ Và Tên</th>
                <th>Email Trường</th>
                <th>Chương Trình</th>
                <th>Trạng Thái</th>
                {canEdit && <th>Thao Tác</th>}
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? students.map(sv => (
                <tr key={sv.id}>
                  <td><span className="badge-blue">{sv.id}</span></td>
                  <td style={{fontWeight: 500}}>{sv.name}</td>
                  <td>{sv.email}</td>
                  <td>{sv.program}</td>
                  <td><span className="status-pass">{sv.status}</span></td>
                  
                  {canEdit && (
                    <td>
                      <button className="btn-sm btn-danger" onClick={() => handleDelete(sv.id, sv.name)}>
                        Xóa
                      </button>
                    </td>
                  )}
                </tr>
              )) : (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px', color: '#888'}}>Không tìm thấy sinh viên nào</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL THÊM SINH VIÊN */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Thêm Hồ Sơ Sinh Viên Mới</h3>
            {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>MSSV (*):</label>
                  <input className="input-control" required placeholder="7 số (VD: 2310744)" 
                         onChange={e => setFormData({...formData, id: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Họ Tên (*):</label>
                  <input className="input-control" required 
                         onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>Email Trường (*):</label>
                <input type="email" className="input-control" required placeholder="xxx@hcmut.edu.vn" 
                       onChange={e => setFormData({...formData, email: e.target.value})} />
                <small style={{color: '#999'}}>Hệ thống sẽ check format email.</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Chương Trình:</label>
                  <select className="input-control" onChange={e => setFormData({...formData, program: e.target.value})}>
                    <option value="Chính quy">Đại trà (Chính quy)</option>
                    <option value="CLC">Chất lượng cao</option>
                    <option value="Kỹ sư tài năng">Kỹ sư tài năng</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Niên Khóa:</label>
                  <input className="input-control" defaultValue="2023" 
                         onChange={e => setFormData({...formData, cohort: e.target.value})} />
                </div>
              </div>

              <div className="actions">
                <button type="submit" className="btn btn-success">Lưu Hồ Sơ</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Đóng</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagerPage;