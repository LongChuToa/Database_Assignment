import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GradeManagementPage = () => {
  const [activeTab, setActiveTab] = useState('grades');
  const [options, setOptions] = useState({ semesters: [], subjects: [], classNames: [] });
  
  // State Search
  const [searchParams, setSearchParams] = useState({
    semester: '', subjectId: '', className: '', minScore: '0'
  });
  const [statThreshold, setStatThreshold] = useState(5);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editScore, setEditScore] = useState('');

  // LOAD OPTIONS
  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/helpers/options')
        .then(res => {
            setOptions(res.data);
            if(res.data.semesters.length) setSearchParams(p => ({...p, semester: res.data.semesters[0]}));
        })
        .catch(err => console.error(err));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setData([]);
    try {
      let res;
      if (activeTab === 'grades') {
        res = await axios.get(`http://localhost:8000/api/v1/procedures/student-grades`, { params: searchParams });
      } else {
         res = await axios.get(`http://localhost:8000/api/v1/procedures/subject-stats`, { params: { threshold: statThreshold } });
      }
      setData(res.data);
    } catch (err) { alert("❌ Lỗi: " + (err.response?.data?.detail || err.message)); }
    finally { setLoading(false); }
  };

  const handleUpdate = async () => {
      try {
          await axios.put(`http://localhost:8000/api/v1/grades/update`, {
              studentId: editingRow['Mã Sinh Viên'],
              semester: searchParams.semester,
              subjectId: searchParams.subjectId,
              className: editingRow['Tên Lớp'],
              newScore: parseFloat(editScore)
          });
          alert("✅ Cập nhật thành công!");
          setEditingRow(null);
          fetchData();
      } catch (err) { alert("Lỗi: " + err.response?.data?.detail); }
  };
  
  const handleDelete = async (row) => {
    if(!window.confirm("Xóa sinh viên khỏi lớp?")) return;
    try {
        await axios.delete(`http://localhost:8000/api/v1/grades/delete`, {
            params: { studentId: row['Mã Sinh Viên'], semester: searchParams.semester, subjectId: searchParams.subjectId, className: row['Tên Lớp'] }
        });
        fetchData();
    } catch (err) { alert("Lỗi: " + err.response?.data?.detail); }
  };

  const inputStyle = { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginRight:'10px' };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>📊 Quản Lý Điểm & Thống Kê</h2>

      <div style={{marginBottom:'20px'}}>
          <button onClick={()=>setActiveTab('grades')} style={{marginRight:'10px'}}>Quản Lý Điểm</button>
          <button onClick={()=>setActiveTab('stats')}>Thống Kê</button>
      </div>

      <div style={{background:'#f8f9fa', padding:'15px', borderRadius:'5px', marginBottom:'20px', border:'1px solid #ddd'}}>
        {activeTab === 'grades' ? (
            <div>
                <h4 style={{marginTop:0}}>🔍 Tìm kiếm & Lọc</h4>
                <div style={{display:'flex', flexWrap:'wrap', gap:'10px', alignItems:'center'}}>
                    {/* SELECT HỌC KÌ */}
                    <select value={searchParams.semester} onChange={e=>setSearchParams({...searchParams, semester: e.target.value})} style={inputStyle}>
                        <option value="">-- Học Kỳ --</option>
                        {options.semesters.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    {/* SELECT MÔN HỌC */}
                    <select value={searchParams.subjectId} onChange={e=>setSearchParams({...searchParams, subjectId: e.target.value})} style={inputStyle}>
                        <option value="">-- Môn Học --</option>
                        {options.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>

                    {/* SELECT TÊN LỚP */}
                    <select value={searchParams.className} onChange={e=>setSearchParams({...searchParams, className: e.target.value})} style={inputStyle}>
                         <option value="">-- Lớp --</option>
                         {options.classNames.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <div style={{display:'flex', alignItems:'center'}}>
                        <label style={{marginRight:'5px'}}>Điểm &ge;</label>
                        <input type="number" value={searchParams.minScore} onChange={e=>setSearchParams({...searchParams, minScore: e.target.value})} style={{...inputStyle, width:'60px'}} />
                    </div>
                    <button onClick={fetchData} style={{background:'#28a745', color:'white', border:'none', padding:'8px 15px'}}>🔎 Tìm Kiếm</button>
                </div>
            </div>
        ) : (
            <div>
                 <h4 style={{marginTop:0}}>📈 Thống kê</h4>
                 <label>Ngưỡng SV tối thiểu: </label>
                 <input type="number" value={statThreshold} onChange={e=>setStatThreshold(e.target.value)} style={inputStyle} />
                 <button onClick={fetchData} style={{background:'#17a2b8', color:'white', border:'none', padding:'8px 15px'}}>Xem Thống Kê</button>
            </div>
        )}
      </div>

      {/* TABLE HIỂN THỊ (Giữ nguyên) */}
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
            <tr style={{background:'#2c3e50', color:'white'}}>
                {data.length > 0 ? Object.keys(data[0]).map(k => <th key={k} style={{padding:'10px'}}>{k}</th>) : <th>Trống</th>}
                {activeTab === 'grades' && <th>Thao tác</th>}
            </tr>
        </thead>
        <tbody>
            {data.map((row, idx) => (
                <tr key={idx} style={{borderBottom:'1px solid #ddd'}}>
                    {Object.values(row).map((v, i) => <td key={i} style={{padding:'10px'}}>{v}</td>)}
                    {activeTab === 'grades' && (
                        <td>
                            <button onClick={()=>{setEditingRow(row); setEditScore(row['Điểm Tổng Kết'])}} style={{marginRight:'5px'}}>Sửa</button>
                            <button onClick={()=>handleDelete(row)} style={{color:'red'}}>Xóa</button>
                        </td>
                    )}
                </tr>
            ))}
        </tbody>
      </table>

      {/* EDIT MODAL */}
      {editingRow && (
          <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center'}}>
              <div style={{background:'white', padding:'20px', width:'300px'}}>
                  <h3>Cập nhật Điểm</h3>
                  <input type="number" value={editScore} onChange={e=>setEditScore(e.target.value)} style={{width:'100%', padding:'8px', marginBottom:'10px'}} />
                  <button onClick={handleUpdate} style={{background:'#28a745', color:'white', border:'none', padding:'8px 15px', marginRight:'5px'}}>Lưu</button>
                  <button onClick={()=>setEditingRow(null)}>Hủy</button>
              </div>
          </div>
      )}
    </div>
  );
};

export default GradeManagementPage;