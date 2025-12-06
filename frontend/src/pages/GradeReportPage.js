// src/frontend/src/pages/GradeReportPage.js
import React, { useState } from 'react';
import axios from 'axios';

const GradeReportPage = () => {
  const [classId, setClassId] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    if(!classId) return alert("Vui lòng nhập mã lớp!");
    setLoading(true);
    try {
      // Gọi API tính điểm (Gọi Function SQL: fn_TinhDiemTongKet)
      const res = await axios.post('http://localhost:8000/api/v1/reports/grades', { classId });
      setReport(res.data);
    } catch (err) {
      alert("Lỗi tính toán: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <h2 className="header-title">Bảng Điểm Tổng Kết (Grade Report)</h2>
      
      <div className="card" style={{display: 'flex', gap: '10px', alignItems: 'flex-end', background: '#eef2f7'}}>
        <div style={{flex: 1}}>
          <label>Nhập Mã Lớp cần tính điểm:</label>
          <input 
            className="input-control" 
            placeholder="VD: L01 (Trong CSDL)" 
            value={classId}
            onChange={e => setClassId(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleGenerateReport} disabled={loading}>
          {loading ? 'Đang tính toán...' : '📥 Xuất Bảng Điểm'}
        </button>
      </div>

      {report && (
        <div className="card animate-fade-in">
          <div className="report-header">
            <h3>{report.className}</h3>
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
              {report.details.map((sv) => (
                <tr key={sv.id}>
                  <td>{sv.id}</td>
                  <td style={{fontWeight: 500}}>{sv.name}</td>
                  <td>{sv.assignment}</td>
                  <td>{sv.exam}</td>
                  {/* Điểm tổng kết được tính từ Function SQL */}
                  <td><span className="badge-score">{sv.final}</span></td>
                  <td>
                    {sv.final >= 5.0 
                      ? <span className="status-pass">Đạt</span> 
                      : <span className="status-fail">Rớt</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="footer-note">* Công thức: 30% Bài tập + 70% Kiểm tra [Quy định BK-LMS]</p>
        </div>
      )}
    </div>
  );
};

export default GradeReportPage;