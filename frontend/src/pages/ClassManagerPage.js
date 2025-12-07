import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClassManagerPage = () => {
  const API_URL = 'http://localhost:8000/api/v1/classes';
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState({ keyword: '', semester: 'HK1-2023' });
  
  // Form thêm mới
  const [form, setForm] = useState({
    semester: 'HK1-2023', subjectId: '', className: '', 
    lecturerId: '', day: '2', time: '07:30:00', location: ''
  });

  // 1. Tải danh sách
  const fetchClasses = async () => {
    try {
      // Gửi params dạng query string
      const res = await axios.post(`${API_URL}/search`, {}, { params: search });
      setClasses(res.data);
    } catch (err) { alert("Lỗi tải dữ liệu"); }
  };

  useEffect(() => { fetchClasses(); }, [search.semester]); // Reload khi đổi kỳ

  // 2. Thêm lớp
  const handleAdd = async () => {
    try {
      await axios.post(`${API_URL}/create`, form);
      alert("✅ Thêm thành công!");
      fetchClasses();
    } catch (err) { alert("Lỗi: " + (err.response?.data?.detail || "Input sai")); }
  };

  // 3. Xóa lớp
  const handleDelete = async (sem, subId, name) => {
    if(!window.confirm("Xóa lớp này?")) return;
    try {
      await axios.delete(`${API_URL}/delete`, {
        params: { semester: sem, subjectId: subId, className: name }
      });
      fetchClasses();
    } catch (err) { alert("Không thể xóa (Ràng buộc dữ liệu)"); }
  };

  return (
    <div style={{padding: '20px'}}>
      <h2>Quản Lý Lớp Học (BTL2 Minimal)</h2>
      
      {/* KHUNG TÌM KIẾM */}
      <div style={{marginBottom: '20px', padding: '15px', background: '#f0f0f0'}}>
        <label>Học kì: </label>
        <select value={search.semester} onChange={e => setSearch({...search, semester: e.target.value})}>
            <option value="HK1-2023">HK1-2023</option>
            <option value="HK2-2023">HK2-2023</option>
            <option value="All">Tất cả</option>
        </select>
        <input placeholder="Tìm tên môn..." value={search.keyword} 
               onChange={e => setSearch({...search, keyword: e.target.value})} style={{marginLeft: '10px'}}/>
        <button onClick={fetchClasses}>Tìm kiếm</button>
      </div>

      {/* FORM THÊM NHANH */}
      <div style={{marginBottom: '20px', border: '1px dashed #ccc', padding: '10px'}}>
        <h4>Thêm Lớp Mới:</h4>
        <input placeholder="Mã Môn (201)" onChange={e => setForm({...form, subjectId: e.target.value})}/>
        <input placeholder="Tên Lớp (L01)" onChange={e => setForm({...form, className: e.target.value})}/>
        <input placeholder="Mã GV (1001)" onChange={e => setForm({...form, lecturerId: e.target.value})}/>
        <input placeholder="Phòng (A101)" onChange={e => setForm({...form, location: e.target.value})}/>
        <button onClick={handleAdd} style={{background: 'green', color: 'white'}}>+ Lưu</button>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <table border="1" cellPadding="8" style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr style={{background: '#007bff', color: 'white'}}>
            <th>Học Kì</th><th>Môn Học</th><th>Lớp</th><th>GV</th><th>Lịch</th><th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((c, i) => (
            <tr key={i}>
              <td>{c['Tên học kì']}</td>
              <td>{c['Tên môn']} ({c['Mã môn học']})</td>
              <td><b>{c['Tên lớp']}</b></td>
              <td>{c['Mã giảng viên']}</td>
              <td>Thứ {c['Thứ']} - {c['Giờ học']} ({c['Địa điểm']})</td>
              <td>
                <button onClick={() => handleDelete(c['Tên học kì'], c['Mã môn học'], c['Tên lớp'])} 
                        style={{color: 'red'}}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassManagerPage;