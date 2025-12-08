// src/frontend/src/pages/ClassManagerPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ClassManagerPage = () => {
  const API_URL = 'http://localhost:8000/api/v1';

  // --- STATE ---
  const [classes, setClasses] = useState([]);
  const [options, setOptions] = useState({ semesters: [], subjects: [], lecturers: [] });
  const [search, setSearch] = useState({ keyword: '', semester: 'All' });
  
  // State Modal Chi tiết (SV + GV)
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [classDetails, setClassDetails] = useState(null);
  
  // --- STATE MỚI: MODAL TÀI LIỆU ---
  const [showDocModal, setShowDocModal] = useState(false);
  const [documents, setDocuments] = useState([]);

  const [currentClassInfo, setCurrentClassInfo] = useState('');
  
  // Form thêm mới
  const [form, setForm] = useState({
    semester: '', subjectId: '', className: '', 
    lecturerId: '', day: '2', time: '07:30:00', location: '', firstStudentId: ''
  });

  // 1. Initial Load
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get(`${API_URL}/lists/options`);
        setOptions(res.data);
        if (res.data.semesters.length > 0) {
            setSearch(prev => ({ ...prev, semester: res.data.semesters[0] }));
            setForm(prev => ({ ...prev, semester: res.data.semesters[0] }));
        }
        if (res.data.subjects.length > 0) setForm(prev => ({ ...prev, subjectId: res.data.subjects[0].id }));
        if (res.data.lecturers.length > 0) setForm(prev => ({ ...prev, lecturerId: res.data.lecturers[0].id }));
      } catch (err) { console.error("Lỗi options:", err); }
    };
    fetchOptions();
  }, []);

  // 2. Fetch Classes
  const fetchClasses = useCallback(async () => {
    try {
      const res = await axios.post(`${API_URL}/classes/search`, {}, { params: search });
      setClasses(res.data);
    } catch (err) { alert("Lỗi tải danh sách lớp"); }
  }, [search]);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);

  // 3. View Details (SV + GV)
  const handleViewDetails = async (sem, subId, name) => {
    try {
      const res = await axios.post(`${API_URL}/classes/details`, { semester: sem, subjectId: subId, className: name });
      setClassDetails(res.data);
      setCurrentClassInfo(`${name} - ${subId} (${sem})`);
      setShowDetailModal(true);
    } catch (err) { alert("Lỗi tải chi tiết: " + err.response?.data?.detail); }
  };

  // --- 4. HÀM MỚI: XEM TÀI LIỆU ---
  const handleViewDocuments = async (sem, subId, name) => {
    try {
      const res = await axios.post(`${API_URL}/classes/documents`, { 
        semester: sem, subjectId: subId, className: name 
      });
      setDocuments(res.data);
      setCurrentClassInfo(`${name} - ${subId} (${sem})`);
      setShowDocModal(true);
    } catch (err) { 
      alert("Lỗi tải tài liệu: " + (err.response?.data?.detail || err.message)); 
    }
  };

  // 5. Add Class
  const handleAdd = async () => {
    if(!form.subjectId || !form.className || !form.lecturerId || !form.firstStudentId) return alert("Thiếu thông tin!");
    try {
      await axios.post(`${API_URL}/classes/create`, form);
      alert("✅ Tạo lớp thành công!");
      fetchClasses();
    } catch (err) { alert("Lỗi: " + (err.response?.data?.detail || "Input sai")); }
  };

  // 6. Delete Class
  const handleDelete = async (sem, subId, name) => {
    if(!window.confirm(`XÓA LỚP ${name}?`)) return;
    try {
      await axios.delete(`${API_URL}/classes/delete`, { params: { semester: sem, subjectId: subId, className: name } });
      alert("Đã xóa lớp!");
      fetchClasses();
    } catch (err) { alert("Lỗi xóa: " + err.response?.data?.detail); }
  };

  return (
    <div style={{padding: '20px', fontFamily: 'Arial, sans-serif'}}>
      <h2 style={{borderBottom:'2px solid #007bff', paddingBottom:'10px'}}>Quản Lý Lớp Học</h2>
      
      {/* SEARCH BAR */}
      <div style={{marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '5px'}}>
        <label style={{marginRight:'10px', fontWeight:'bold'}}>Học kì: </label>
        <select value={search.semester} onChange={e => setSearch({...search, semester: e.target.value})} style={{padding: '5px', marginRight:'20px'}}>
            <option value="All">-- Tất cả --</option>
            {options.semesters.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input placeholder="Tìm môn học..." value={search.keyword} onChange={e => setSearch({...search, keyword: e.target.value})} style={{padding: '5px', width:'200px'}}/>
      </div>

      {/* FORM ADD */}
      <div style={{marginBottom: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '5px', background:'#fff'}}>
        <h4 style={{marginTop: 0, color:'#28a745'}}>+ Tạo Lớp Mới</h4>
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems:'flex-end'}}>
            <div style={{flex:1}}>
                <small>Học Kỳ</small><br/>
                <select style={{width:'100%', padding:'8px'}} value={form.semester} onChange={e => setForm({...form, semester: e.target.value})}>
                    <option value="">-- Chọn --</option>
                    {options.semesters.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div style={{flex:2}}>
                <small>Môn Học</small><br/>
                <select style={{width:'100%', padding:'8px'}} value={form.subjectId} onChange={e => setForm({...form, subjectId: e.target.value})}>
                    <option value="">-- Chọn Môn --</option>
                    {options.subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                </select>
            </div>
            <div style={{flex:1}}>
                <small>Tên Lớp</small><br/>
                <input placeholder="VD: L01" value={form.className} onChange={e => setForm({...form, className: e.target.value})} style={{width:'100%', padding:'8px', boxSizing:'border-box'}}/>
            </div>
            <div style={{flex:2}}>
                <small>Giảng Viên</small><br/>
                <select style={{width:'100%', padding:'8px'}} value={form.lecturerId} onChange={e => setForm({...form, lecturerId: e.target.value})}>
                    <option value="">-- Chọn GV --</option>
                    {options.lecturers.map(gv => <option key={gv.id} value={gv.id}>{gv.name}</option>)}
                </select>
            </div>
            <div style={{flex:1}}>
                <small style={{color:'red'}}>SV Đầu Tiên (*)</small><br/>
                <input placeholder="MSSV" value={form.firstStudentId} onChange={e => setForm({...form, firstStudentId: e.target.value})} style={{width:'100%', padding:'8px', border:'1px solid green', boxSizing:'border-box'}}/>
            </div>
            <button onClick={handleAdd} style={{background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', height:'35px', cursor:'pointer'}}>LƯU</button>
        </div>
      </div>

      {/* TABLE */}
      <table style={{width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
        <thead>
          <tr style={{background: '#343a40', color: 'white', textAlign: 'left'}}>
            <th style={{padding: '12px'}}>Học Kì</th>
            <th style={{padding: '12px'}}>Môn Học</th>
            <th style={{padding: '12px'}}>Lớp</th>
            <th style={{padding: '12px'}}>Giảng Viên</th>
            <th style={{padding: '12px', textAlign:'center'}}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {classes.length > 0 ? classes.map((c, i) => (
            <tr key={i} style={{borderBottom: '1px solid #eee'}}>
              <td style={{padding: '12px'}}>{c['Tên học kì']}</td>
              <td style={{padding: '12px'}}>{c['Tên môn']} ({c['Mã môn học']})</td>
              <td style={{padding: '12px', fontWeight: 'bold', color:'#007bff'}}>{c['Tên lớp']}</td>
              <td style={{padding: '12px'}}>{c['Tên GV']}</td>
              <td style={{padding: '12px', textAlign:'center', display:'flex', justifyContent:'center', gap:'5px'}}>
                <button onClick={() => handleViewDetails(c['Tên học kì'], c['Mã môn học'], c['Tên lớp'])} 
                        style={{background:'#17a2b8', color:'white', border:'none', padding:'6px 12px', borderRadius:'3px', cursor:'pointer'}}>Chi tiết</button>
                
                {/* NÚT XEM TÀI LIỆU */}
                <button onClick={() => handleViewDocuments(c['Tên học kì'], c['Mã môn học'], c['Tên lớp'])} 
                        style={{background:'#ffc107', color:'#000', border:'none', padding:'6px 12px', borderRadius:'3px', cursor:'pointer'}}>Tài liệu</button>
                
                <button onClick={() => handleDelete(c['Tên học kì'], c['Mã môn học'], c['Tên lớp'])} 
                        style={{background:'#dc3545', color:'white', border:'none', padding:'6px 12px', borderRadius:'3px', cursor:'pointer'}}>Xóa</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="5" style={{textAlign:'center', padding:'20px', color:'#777'}}>Không có dữ liệu.</td></tr>
          )}
        </tbody>
      </table>

      {/* MODAL CHI TIẾT (SV + GV) */}
      {showDetailModal && classDetails && (
        <div style={modalStyle}>
            <div style={modalContentStyle}>
                <h3 style={{margin:'0 0 15px 0', borderBottom:'1px solid #eee', paddingBottom:'10px'}}>Chi Tiết Lớp Học</h3>
                <p style={{color:'#666'}}>{currentClassInfo}</p>
                <div style={{marginBottom:'20px', padding:'10px', background:'#e9f7ef', borderRadius:'4px'}}>
                    <strong>Giảng viên: </strong> {classDetails.lecturer}
                </div>
                <h4>Danh sách Sinh viên ({classDetails.students.length})</h4>
                <table style={{width: '100%', borderCollapse: 'collapse', fontSize:'14px'}}>
                    <thead>
                        <tr style={{background: '#e9ecef'}}>
                            <th style={{padding:'8px', border:'1px solid #ddd'}}>MSSV</th>
                            <th style={{padding:'8px', border:'1px solid #ddd'}}>Họ Tên</th>
                            <th style={{padding:'8px', border:'1px solid #ddd'}}>Trạng Thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classDetails.students.map(sv => (
                            <tr key={sv['Mã EDUMEMBER']}>
                                <td style={{padding:'8px', border:'1px solid #ddd'}}>{sv['Mã EDUMEMBER']}</td>
                                <td style={{padding:'8px', border:'1px solid #ddd'}}>{sv['Họ và tên']}</td>
                                <td style={{padding:'8px', border:'1px solid #ddd'}}>{sv['Trạng thái học']}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{marginTop:'20px', textAlign:'right'}}><button onClick={() => setShowDetailModal(false)} style={closeBtnStyle}>Đóng</button></div>
            </div>
        </div>
      )}

      {/* MODAL TÀI LIỆU (MỚI) */}
      {showDocModal && (
        <div style={modalStyle}>
            <div style={modalContentStyle}>
                <h3 style={{margin:'0 0 15px 0', borderBottom:'1px solid #eee', paddingBottom:'10px'}}>Tài Liệu Lớp Học</h3>
                <p style={{color:'#666'}}>{currentClassInfo}</p>
                
                <table style={{width: '100%', borderCollapse: 'collapse', fontSize:'14px', marginTop:'10px'}}>
                    <thead>
                        <tr style={{background: '#fff3cd'}}>
                            <th style={{padding:'8px', border:'1px solid #ddd'}}>Tên Tài Liệu</th>
                            <th style={{padding:'8px', border:'1px solid #ddd'}}>Mô Tả</th>
                            <th style={{padding:'8px', border:'1px solid #ddd'}}>Loại</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.length > 0 ? documents.map(doc => (
                            <tr key={doc.id}>
                                <td style={{padding:'8px', border:'1px solid #ddd', fontWeight:'bold'}}>{doc.name}</td>
                                <td style={{padding:'8px', border:'1px solid #ddd'}}>{doc.description}</td>
                                <td style={{padding:'8px', border:'1px solid #ddd'}}>{doc.types}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="3" style={{textAlign:'center', padding:'15px'}}>Lớp này chưa có tài liệu.</td></tr>
                        )}
                    </tbody>
                </table>
                <div style={{marginTop:'20px', textAlign:'right'}}><button onClick={() => setShowDocModal(false)} style={closeBtnStyle}>Đóng</button></div>
            </div>
        </div>
      )}
    </div>
  );
};

// Style objects cho gọn code
const modalStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};
const modalContentStyle = {
    background: 'white', padding: '25px', borderRadius: '8px', width: '600px', maxHeight: '85vh', overflowY: 'auto'
};
const closeBtnStyle = {
    padding:'8px 20px', background:'#6c757d', color:'white', border:'none', borderRadius:'4px', cursor:'pointer'
};

export default ClassManagerPage;