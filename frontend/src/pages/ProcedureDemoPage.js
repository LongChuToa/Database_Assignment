import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProcedureDemoPage = () => {
  const [activeTab, setActiveTab] = useState('enroll');
  
  // --- STATE OPTIONS (Dữ liệu cho Dropdown) ---
  const [options, setOptions] = useState({
    semesters: [], faculties: [], subjects: [], classNames: [], 
    docTypes: [], libraries: [], admins: [], teachers: [], students: []
  });

  // --- STATE DỮ LIỆU BẢNG ---
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // --- STATE MODAL EDIT USER ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUserForm, setEditUserForm] = useState({
    id: '', email: '', username: '', password: '', fullName: '', address: ''
  });

  // --- STATE FORMS NHẬP LIỆU ---
  const [enrollForm, setEnrollForm] = useState({
    id: '', email: '', username: '', password: '', fullName: '', address: '',
    adminId: '', className: '', program: 'Chính quy', cohort: '2023', facultyId: '',
    semester: '', subjectId: '', enrollClass: ''
  });
  const [classForm, setClassForm] = useState({
    semester: '', subjectId: '', className: '', 
    teacherId: '', studentId: '', day: '2', time: '07:00:00', room: 'A101'
  });
  const [docForm, setDocForm] = useState({
    docId: '', libraryId: '', name: '', date: '2023-01-01', typeName: ''
  });
  const [libForm, setLibForm] = useState({
    libraryId: '', year: '2000', adminId: ''
  });

  // --- LOAD DỮ LIỆU BAN ĐẦU ---
  useEffect(() => {
    // 1. Load các Options cho dropdown
    const fetchOptions = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/helpers/options');
            setOptions(res.data);
            
            // Set default values để tránh dropdown trống
            if(res.data.semesters.length) {
                const defaultSem = res.data.semesters[0];
                setEnrollForm(prev => ({...prev, semester: defaultSem}));
                setClassForm(prev => ({...prev, semester: defaultSem}));
            }
        } catch (err) { console.error("Lỗi load options:", err); }
    };
    fetchOptions();
  }, []);

  // --- HÀM LOAD TABLE DATA ---
  const fetchTableData = async () => {
    let endpoint = '';
    if (activeTab === 'enroll') endpoint = 'view/students';
    if (activeTab === 'class') endpoint = 'view/classes';
    if (activeTab === 'doc') endpoint = 'view/documents';
    if (activeTab === 'lib') endpoint = 'view/libraries';

    if (endpoint) {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/${endpoint}`);
        setTableData(res.data);
      } catch (err) { console.error("Lỗi load table:", err); }
    }
  };

  useEffect(() => {
    setSearchTerm(''); 
    fetchTableData();
  }, [activeTab]);

  // --- HANDLERS (SUBMIT, DELETE, EDIT - Giữ nguyên logic) ---
  const handleSubmit = async (endpoint, data) => {
    try {
      await axios.post(`http://localhost:8000/api/v1/${endpoint}`, data);
      alert("✅ Thành công!");
      fetchTableData();
    } catch (err) { alert("❌ Lỗi: " + (err.response?.data?.detail || err.message)); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm(`⚠️ Xóa User ID: ${id}? (Cascade Delete)`)) return;
    try {
      await axios.delete(`http://localhost:8000/api/v1/users/${id}`);
      alert("✅ Đã xóa!");
      fetchTableData();
    } catch (err) { alert("❌ Lỗi xóa: " + (err.response?.data?.detail || err.message)); }
  };

  const handleEditClick = (row) => {
    setEditUserForm({
      id: row.ID, fullName: row.Name || '', email: row.Email || '',
      username: '', password: '', address: ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`http://localhost:8000/api/v1/users/${editUserForm.id}`, editUserForm);
      alert("✅ Cập nhật thành công!");
      setIsEditModalOpen(false);
      fetchTableData();
    } catch (err) { alert("❌ Lỗi cập nhật: " + (err.response?.data?.detail || err.message)); }
  };

  // --- STYLES ---
  const containerStyle = { padding: '20px', maxWidth: '1000px', margin: '0 auto' };
  const inputStyle = { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' };
  const btnStyle = { padding:'10px', background: '#28a745', color: '#fff', border: 'none', borderRadius:'4px', cursor: 'pointer', marginTop:'10px', width:'100%' };
  const tabBtnStyle = (isActive) => ({ padding: '10px 20px', cursor: 'pointer', border: 'none', background: isActive ? '#007bff' : '#ddd', color: isActive ? '#fff' : '#000', borderRadius: '5px', marginRight:'5px' });

  // --- RENDER ---
  return (
    <div style={containerStyle}>
      <h2>🚀 BTL Database Procedure Demo</h2>
      
      {/* TABS */}
      <div style={{marginBottom:'20px'}}>
        <button style={tabBtnStyle(activeTab === 'enroll')} onClick={() => setActiveTab('enroll')}>1. Nhập học (SV)</button>
        <button style={tabBtnStyle(activeTab === 'class')} onClick={() => setActiveTab('class')}>2. Mở Lớp (GV)</button>
        <button style={tabBtnStyle(activeTab === 'doc')} onClick={() => setActiveTab('doc')}>3. Tài liệu</button>
        <button style={tabBtnStyle(activeTab === 'lib')} onClick={() => setActiveTab('lib')}>4. Thư viện</button>
      </div>

      {/* INPUT FORM SECTION */}
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px', background:'#f8f9fa', marginBottom:'30px' }}>
        <h4 style={{marginTop:0, color:'#007bff'}}>📝 Nhập Liệu (Tác động Database)</h4>
        
        {activeTab === 'enroll' && (
          <div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px'}}>
              <input placeholder="MSSV Mới (VD: 2023001)" value={enrollForm.id} onChange={e=>setEnrollForm({...enrollForm, id: e.target.value})} style={inputStyle}/>
              <input placeholder="Họ tên" value={enrollForm.fullName} onChange={e=>setEnrollForm({...enrollForm, fullName: e.target.value})} style={inputStyle}/>
              <input placeholder="Email" value={enrollForm.email} onChange={e=>setEnrollForm({...enrollForm, email: e.target.value})} style={inputStyle}/>
              <input placeholder="Username" value={enrollForm.username} onChange={e=>setEnrollForm({...enrollForm, username: e.target.value})} style={inputStyle}/>
              <input placeholder="Password" type="password" value={enrollForm.password} onChange={e=>setEnrollForm({...enrollForm, password: e.target.value})} style={inputStyle}/>
              
              {/* Select Admin */}
              <select value={enrollForm.adminId} onChange={e=>setEnrollForm({...enrollForm, adminId: e.target.value})} style={inputStyle}>
                  <option value="">-- Chọn Admin Giám sát --</option>
                  {options.admins.map(a => <option key={a.id} value={a.id}>{a.name} ({a.id})</option>)}
              </select>

              {/* Select Khoa */}
              <select value={enrollForm.facultyId} onChange={e=>setEnrollForm({...enrollForm, facultyId: e.target.value})} style={inputStyle}>
                  <option value="">-- Chọn Khoa --</option>
                  {options.faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>

              <input placeholder="Lớp SH (VD: L01)" value={enrollForm.className} onChange={e=>setEnrollForm({...enrollForm, className: e.target.value})} style={inputStyle}/>
              
              {/* Select Môn */}
              <select value={enrollForm.subjectId} onChange={e=>setEnrollForm({...enrollForm, subjectId: e.target.value})} style={inputStyle}>
                  <option value="">-- Chọn Môn Đăng ký --</option>
                  {options.subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
              </select>

               {/* Select Học kì */}
               <select value={enrollForm.semester} onChange={e=>setEnrollForm({...enrollForm, semester: e.target.value})} style={inputStyle}>
                  <option value="">-- Chọn Học kỳ --</option>
                  {options.semesters.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              
              <input placeholder="Tên Lớp học phần (VD: L01)" value={enrollForm.enrollClass} onChange={e=>setEnrollForm({...enrollForm, enrollClass: e.target.value})} style={inputStyle}/>
            </div>
            <button style={btnStyle} onClick={() => handleSubmit('enrollment/student', enrollForm)}>Thực thi SP Nhập Học</button>
          </div>
        )}
        
        {activeTab === 'class' && (
            <div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px'}}>
                <select value={classForm.semester} onChange={e=>setClassForm({...classForm, semester: e.target.value})} style={inputStyle}>
                  <option value="">-- Chọn Học kỳ --</option>
                  {options.semesters.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select value={classForm.subjectId} onChange={e=>setClassForm({...classForm, subjectId: e.target.value})} style={inputStyle}>
                  <option value="">-- Chọn Môn học --</option>
                  {options.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>

                <input placeholder="Tên Lớp (VD: L02)" value={classForm.className} onChange={e=>setClassForm({...classForm, className: e.target.value})} style={inputStyle}/>
                
                <select value={classForm.teacherId} onChange={e=>setClassForm({...classForm, teacherId: e.target.value})} style={inputStyle}>
                  <option value="">-- Chọn Giảng viên --</option>
                  {options.teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>

                <select value={classForm.studentId} onChange={e=>setClassForm({...classForm, studentId: e.target.value})} style={inputStyle}>
                  <option value="">-- Chọn SV đầu tiên --</option>
                  {options.students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                </select>

                <input placeholder="Phòng (VD: A101)" value={classForm.room} onChange={e=>setClassForm({...classForm, room: e.target.value})} style={inputStyle}/>
              </div>
              <button style={btnStyle} onClick={() => handleSubmit('classes', classForm)}>Thực thi SP Mở Lớp</button>
            </div>
        )}

         {activeTab === 'doc' && (
            <div>
                 <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                    <input placeholder="Mã Tài liệu" value={docForm.docId} onChange={e=>setDocForm({...docForm, docId: e.target.value})} style={inputStyle}/>
                    
                    <select value={docForm.libraryId} onChange={e=>setDocForm({...docForm, libraryId: e.target.value})} style={inputStyle}>
                        <option value="">-- Chọn Thư viện --</option>
                        {options.libraries.map(l => <option key={l.id} value={l.id}>Thư viện {l.id} (Năm {l.year})</option>)}
                    </select>

                    <input placeholder="Tên tài liệu" value={docForm.name} onChange={e=>setDocForm({...docForm, name: e.target.value})} style={inputStyle}/>
                    
                    <select value={docForm.typeName} onChange={e=>setDocForm({...docForm, typeName: e.target.value})} style={inputStyle}>
                        <option value="">-- Chọn Loại tài liệu --</option>
                        {options.docTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                 </div>
                 <button style={btnStyle} onClick={() => handleSubmit('documents', docForm)}>Thực thi SP Thêm Tài Liệu</button>
            </div>
        )}

        {activeTab === 'lib' && (
             <div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px'}}>
                 <input placeholder="Mã Thư viện" value={libForm.libraryId} onChange={e=>setLibForm({...libForm, libraryId: e.target.value})} style={inputStyle}/>
                 <input placeholder="Năm thành lập" value={libForm.year} onChange={e=>setLibForm({...libForm, year: e.target.value})} style={inputStyle}/>
                 
                 <select value={libForm.adminId} onChange={e=>setLibForm({...libForm, adminId: e.target.value})} style={inputStyle}>
                    <option value="">-- Chọn Admin Quản lý --</option>
                    {options.admins.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                 </select>
               </div>
               <button style={btnStyle} onClick={() => handleSubmit('libraries', libForm)}>Thực thi SP Thêm Thư Viện</button>
             </div>
        )}
      </div>

      {/* DATA VIEW TABLE (Giữ nguyên logic hiển thị) */}
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
                <tr style={{background:'#343a40', color:'white'}}>
                    {tableData.length > 0 ? Object.keys(tableData[0]).map(k => <th key={k} style={{padding:'10px'}}>{k}</th>) : <th>Chưa có dữ liệu</th>}
                    {activeTab === 'enroll' && <th style={{padding:'10px'}}>Thao tác</th>}
                </tr>
            </thead>
            <tbody>
                {tableData.map((row, i) => (
                    <tr key={i} style={{borderBottom:'1px solid #ddd'}}>
                        {Object.values(row).map((v, j) => <td key={j} style={{padding:'8px'}}>{v}</td>)}
                        {activeTab === 'enroll' && (
                            <td style={{padding:'8px'}}>
                                <button onClick={()=>handleEditClick(row)} style={{marginRight:'5px'}}>✏️</button>
                                <button onClick={()=>handleDeleteUser(row.ID)} style={{color:'red'}}>🗑️</button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
      
      {/* Modal Edit (Giữ nguyên logic) */}
      {isEditModalOpen && (
          <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center'}}>
              <div style={{background:'white', padding:'20px', width:'300px'}}>
                  <h3>Edit User</h3>
                  <input value={editUserForm.fullName} onChange={e=>setEditUserForm({...editUserForm, fullName:e.target.value})} style={{...inputStyle, marginBottom:'10px'}} />
                  <input value={editUserForm.email} onChange={e=>setEditUserForm({...editUserForm, email:e.target.value})} style={{...inputStyle, marginBottom:'10px'}} />
                  <button onClick={handleUpdateUser} style={btnStyle}>Save</button>
                  <button onClick={()=>setIsEditModalOpen(false)} style={{...btnStyle, background:'#6c757d', marginTop:'5px'}}>Cancel</button>
              </div>
          </div>
      )}
    </div>
  );
};

export default ProcedureDemoPage;