import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FunctionPage = () => {
  const [options, setOptions] = useState({ students: [], semesters: [] });
  const [creditForm, setCreditForm] = useState({ studentId: '', passScore: '4.0' });
  const [creditResult, setCreditResult] = useState(null);
  const [statusForm, setStatusForm] = useState({ studentId: '', semester: '' });
  const [statusResult, setStatusResult] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/helpers/options')
        .then(res => setOptions(res.data))
        .catch(err => console.error(err));
  }, []);

  const handleCalcCredits = async () => {
    if (!creditForm.studentId) return alert("Vui lòng chọn Sinh viên");
    try {
        setCreditResult('Đang tính...');
        const res = await axios.get(`http://localhost:8000/api/v1/functions/credits`, { params: creditForm });
        setCreditResult(res.data.totalCredits);
    } catch (err) { setCreditResult("❌ Lỗi: " + err.message); }
  };

  const handleCheckStatus = async () => {
    if (!statusForm.studentId || !statusForm.semester) return alert("Vui lòng chọn đủ thông tin");
    try {
        setStatusResult('Đang kiểm tra...');
        const res = await axios.get(`http://localhost:8000/api/v1/functions/status`, { params: statusForm });
        setStatusResult(res.data.status);
    } catch (err) { setStatusResult("❌ Lỗi: " + err.message); }
  };

  const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' };
  const cardStyle = { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{textAlign: 'center', color: '#2c3e50'}}>🔮 Tiện ích SQL Functions</h2>

      <div style={cardStyle}>
        <h3>1. Tính Tổng Tín Chỉ</h3>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
            <select value={creditForm.studentId} onChange={e => setCreditForm({...creditForm, studentId: e.target.value})} style={inputStyle}>
                <option value="">-- Chọn Sinh viên --</option>
                {options.students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
            </select>
            <input placeholder="Điểm sàn (VD: 4.0)" value={creditForm.passScore} onChange={e => setCreditForm({...creditForm, passScore: e.target.value})} style={inputStyle}/>
        </div>
        <button onClick={handleCalcCredits} style={{marginTop: '15px', padding: '12px', background: '#2980b9', color: 'white', border: 'none', width: '100%'}}>Tính Toán</button>
        {creditResult !== null && <div style={{marginTop:'10px', fontWeight:'bold'}}>Kết quả: {creditResult} tín chỉ</div>}
      </div>

      <div style={cardStyle}>
        <h3>2. Kiểm Tra Trạng Thái</h3>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
            <select value={statusForm.studentId} onChange={e => setStatusForm({...statusForm, studentId: e.target.value})} style={inputStyle}>
                <option value="">-- Chọn Sinh viên --</option>
                {options.students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
            </select>
            <select value={statusForm.semester} onChange={e => setStatusForm({...statusForm, semester: e.target.value})} style={inputStyle}>
                <option value="">-- Chọn Học kỳ --</option>
                {options.semesters.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
        <button onClick={handleCheckStatus} style={{marginTop: '15px', padding: '12px', background: '#c0392b', color: 'white', border: 'none', width: '100%'}}>Kiểm Tra</button>
        {statusResult !== null && <div style={{marginTop:'10px', fontWeight:'bold'}}>Trạng thái: {statusResult}</div>}
      </div>
    </div>
  );
};

export default FunctionPage;