// src/frontend/src/pages/ListPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ListPage = ({ onEdit }) => {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  // Cấu hình URL Backend
  const API_BASE_URL = 'http://localhost:8000/api/v1';

  // Hàm gọi API lấy danh sách lớp (Gọi SP Search)
  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      // Gọi API: POST /classes/search
      const payload = {
        keyword: searchTerm,
        semester: semesterFilter === 'All' ? null : semesterFilter
      };
      
      const response = await axios.post(`${API_BASE_URL}/classes/search`, payload);
      setClasses(response.data); // Dữ liệu thật từ SQL trả về
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      alert("Không kết nối được Backend!");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, semesterFilter]);

  // Gọi API mỗi khi filter thay đổi hoặc mới vào trang
  useEffect(() => {
    const timer = setTimeout(() => {
        fetchClasses();
    }, 500); // Debounce: Đợi 0.5s sau khi gõ phím mới gọi API
    return () => clearTimeout(timer);
  }, [fetchClasses]);

  const handleDelete = async (id, code) => {
    if (window.confirm(`Bạn muốn xóa lớp ${code}? (Thao tác này sẽ gọi sp_XoaLopHoc)`)) {
      try {
        await axios.delete(`${API_BASE_URL}/classes/${id}`);
        alert("Xóa thành công!");
        fetchClasses(); // Load lại danh sách sau khi xóa
      } catch (error) {
        alert("Lỗi xóa: " + (error.response?.data?.detail || error.message));
      }
    }
  };

  return (
    <div className="card">
      <h2 className="header-title">Tra Cứu Lịch Mở Lớp (Câu 3.2)</h2>
      
      {/* Search & Filter */}
      <div className="form-row" style={{ alignItems: 'flex-end', background: '#f8f9fa', padding: '15px', borderRadius: '4px' }}>
        <div style={{ flex: 2 }}>
          <label>Tìm kiếm môn học:</label>
          <input 
            type="text" 
            className="input-control" 
            placeholder="Nhập tên môn..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>Học kỳ:</label>
          <select 
            className="input-control" 
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
          >
            <option value="All">-- Tất cả --</option>
            <option value="HK241">HK1 / 2024-2025</option>
            <option value="HK242">HK2 / 2024-2025</option>
          </select>
        </div>
      </div>

      {loading ? <p style={{textAlign:'center', padding:'20px'}}>Đang tải dữ liệu từ Database...</p> : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã Lớp</th>
              <th>Môn Học</th>
              <th>Học Kỳ</th>
              <th>Giảng Viên</th>
              <th>Lịch Học</th>
              <th>Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {classes.length > 0 ? (
              classes.map((item, index) => (
                <tr key={index}>
                  {/* Lưu ý: Tên trường (item.xxx) phải khớp với cột SQL SELECT trả về */}
                  <td><span style={{fontWeight: 'bold', color: 'var(--bk-blue)'}}>{item.classCode || item.MaLop}</span></td>
                  <td>{item.subjectName || item.TenMonHoc}</td>
                  <td><span className="status-badge status-active">{item.semester || item.HocKy}</span></td>
                  <td>{item.lecturer || item.TenGV}</td>
                  <td>{item.schedule || item.LichHoc}</td>
                  <td style={{ display: 'flex', gap: '5px' }}>
                    <button className="btn btn-primary" style={{padding: '5px 10px', fontSize: '12px'}} onClick={onEdit}>Sửa</button>
                    <button className="btn btn-danger" style={{padding: '5px 10px', fontSize: '12px'}} onClick={() => handleDelete(item.id || item.MaLopID, item.classCode)}>Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Không tìm thấy dữ liệu (Hoặc chưa điền SQL trong Backend).</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListPage;