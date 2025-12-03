// src/frontend/src/pages/ReportPage.js
import React, { useState } from 'react';
import axios from 'axios';

const ReportPage = () => {
  const [classId, setClassId] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'http://localhost:8000/api/v1';

  const handleRunFunction = async () => {
    if (!classId) return;
    setLoading(true);
    setReportData(null);

    try {
      // Gọi API: POST /reports/grades
      const res = await axios.post(`${API_BASE_URL}/reports/grades`, { classId });
      setReportData(res.data);
    } catch (error) {
      alert("Lỗi tính toán: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="header-title">Thống Kê Điểm Số & Kết Quả (Câu 3.3)</h2>

      <div style={{ display: 'flex', gap: '15px', background: '#e3f2fd', padding: '20px', borderRadius: '4px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{color: '#0d47a1'}}>Nhập Mã Lớp để tính toán:</label>
          <input 
             type="text" className="input-control" placeholder="VD: L01"
             value={classId} onChange={(e) => setClassId(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleRunFunction} style={{height: '40px'}} disabled={loading}>
          {loading ? 'Đang chạy Function SQL...' : 'Chạy Hàm Tính Điểm'}
        </button>
      </div>

      {reportData && (
        <div style={{ marginTop: '30px' }}>
          {/* Summary Cards */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ flex: 1, background: '#2c3e50', color: 'white', padding: '20px', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{reportData.avgScore}</div>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>ĐIỂM TRUNG BÌNH</div>
            </div>
            <div style={{ flex: 1, background: '#27ae60', color: 'white', padding: '20px', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{reportData.passRate}</div>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>TỈ LỆ QUA MÔN</div>
            </div>
            <div style={{ flex: 1, background: '#d35400', color: 'white', padding: '20px', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{reportData.totalStudents}</div>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>SĨ SỐ</div>
            </div>
          </div>

          <h3 style={{ color: '#2c3e50', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Chi tiết bảng điểm ({reportData.className})</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>MSSV</th>
                <th>Họ Tên</th>
                <th>Điểm BT</th>
                <th>Điểm Thi</th>
                <th>Tổng Kết</th>
              </tr>
            </thead>
            <tbody>
              {reportData.details.map((sv, idx) => (
                <tr key={idx}>
                  <td>{sv.id}</td>
                  <td>{sv.name}</td>
                  <td>{sv.assignment}</td>
                  <td>{sv.exam}</td>
                  <td style={{ fontWeight: 'bold', color: 'var(--bk-blue)' }}>{sv.final}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportPage;