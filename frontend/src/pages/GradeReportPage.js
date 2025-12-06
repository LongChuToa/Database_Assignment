// src/frontend/src/pages/GradeReportPage.js
import React, { useState } from 'react';
import axios from 'axios';

const GradeReportPage = () => {
  // Thay đổi State: Dùng object để chứa 3 khóa chính (Composite Key)
  const [inputData, setInputData] = useState({
    semester: 'Học kỳ 1 Năm 2024-2025', // Giá trị mặc định khớp với DB
    subjectId: '',
    className: ''
  });
  
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    // Validate dữ liệu đầu vào
    if (!inputData.subjectId || !inputData.className) {
        return alert("Vui lòng nhập đầy đủ Mã môn học và Tên lớp!");
    }

    setLoading(true);
    setReport(null); // Clear kết quả cũ

    try {
      // Gọi API tính điểm (Backend sẽ nhận 3 tham số này để gọi Function SQL)
      const res = await axios.post('http://localhost:8000/api/v1/reports/grades', inputData);
      setReport(res.data);
    } catch (err) {
      // Xử lý lỗi (VD: Lớp không tồn tại)
      const errorMsg = err.response?.data?.detail || err.message;
      alert("Lỗi tính toán: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <h2 className="header-title">Bảng Điểm Tổng Kết (Grade Report)</h2>
      
      {/* KHU VỰC NHẬP LIỆU (Đã sửa để nhập 3 khóa chính) */}
      <div className="card" style={{background: '#eef2f7'}}>
        <div className="form-row" style={{alignItems: 'flex-end', marginBottom: 0}}>
            
            <div className="form-group" style={{flex: 1.5}}>
                <label>Học Kỳ:</label>
                <select 
                    className="input-control" 
                    value={inputData.semester}
                    onChange={e => setInputData({...inputData, semester: e.target.value})}
                >
                    <option value="Học kỳ 1 Năm 2024-2025">Học kỳ 1 Năm 2024-2025</option>
                    <option value="Học kỳ 2 Năm 2024-2025">Học kỳ 2 Năm 2024-2025</option>
                </select>
            </div>

            <div className="form-group" style={{flex: 1}}>
                <label>Mã Môn Học:</label>
                <input 
                    className="input-control" 
                    placeholder="VD: CO2013" 
                    value={inputData.subjectId}
                    onChange={e => setInputData({...inputData, subjectId: e.target.value})}
                />
            </div>

            <div className="form-group" style={{flex: 1}}>
                <label>Tên Lớp:</label>
                <input 
                    className="input-control" 
                    placeholder="VD: L01" 
                    value={inputData.className}
                    onChange={e => setInputData({...inputData, className: e.target.value})}
                />
            </div>

            <div style={{marginBottom: '2px'}}> {/* Căn chỉnh nút bấm */}
                <button className="btn btn-primary" onClick={handleGenerateReport} disabled={loading}>
                    {loading ? 'Đang tải...' : '📥 Xem Điểm'}
                </button>
            </div>
        </div>
      </div>

      {/* KẾT QUẢ HIỂN THỊ */}
      {report && (
        <div className="card animate-fade-in" style={{marginTop: '20px'}}>
          <div className="report-header">
            <h3>Kết quả: {report.className}</h3>
            <div className="stats-row">
              <div className="stat-box">
                <span>Sĩ số</span>
                <strong>{report.totalStudents}</strong>
              </div>
              <div className="stat-box">
                <span>Điểm TB Lớp</span>
                <strong>{report.avgScore}</strong>
              </div>
              <div className="stat-box success">
                <span>Tỉ lệ Qua Môn</span>
                <strong>{report.passRate}</strong>
              </div>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>MSSV</th>
                <th>Họ Tên</th>
                <th>Bài Tập (30%)</th>
                <th>Cuối Kỳ (70%)</th>
                <th>Tổng Kết</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {report.details.length > 0 ? (
                  report.details.map((sv) => (
                    <tr key={sv.id}>
                      <td><span className="badge-blue">{sv.id}</span></td>
                      <td style={{fontWeight: 500}}>{sv.name}</td>
                      <td>{sv.assignment}</td>
                      <td>{sv.exam}</td>
                      <td><span className="badge-score">{sv.final}</span></td>
                      <td>
                        {sv.final >= 5.0 
                          ? <span className="status-pass">Đạt</span> 
                          : <span className="status-fail">Rớt</span>}
                      </td>
                    </tr>
                  ))
              ) : (
                  <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>Lớp này chưa có sinh viên hoặc chưa nhập điểm.</td></tr>
              )}
            </tbody>
          </table>
          <p className="footer-note">* Dữ liệu được tính toán trực tiếp từ Function SQL Server</p>
        </div>
      )}
    </div>
  );
};

export default GradeReportPage;