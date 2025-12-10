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
  const [filterType, setFilterType] = useState('all'); // Giữ lại nếu cần dùng

  // --- STATE MODAL EDIT USER ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUserForm, setEditUserForm] = useState({
    id: '', email: '', username: '', password: '', fullName: '', address: ''
  });
  
  // --- STATE FORMS NHẬP LIỆU ---
  
  // 1. Form thông tin chung của Sinh Viên
  const [studentInfoForm, setStudentInfoForm] = useState({
    id: '', email: '', username: '', password: '', fullName: '', address: '',
    adminId: '', className: '', program: 'Chính quy', cohort: '2023', facultyId: ''
  });

  // 2. State lưu danh sách lớp muốn đăng ký (Mảng các object)
  const [addedClasses, setAddedClasses] = useState([]);

  // 3. Form nhập liệu tạm thời cho một lớp học phần
  const [currentClassInput, setCurrentClassInput] = useState({
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

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewStudentData, setViewStudentData] = useState(null);
  const [studentEnrollments, setStudentEnrollments] = useState([]); // Danh sách môn đã học

  // --- LOAD DỮ LIỆU BAN ĐẦU ---
  useEffect(() => {
    const fetchOptions = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/helpers/options');
            setOptions(res.data);
            
            if(res.data.semesters.length) {
                const defaultSem = res.data.semesters[0];
                setCurrentClassInput(prev => ({...prev, semester: defaultSem}));
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
    fetchTableData();
  }, [activeTab]);

  // --- HANDLERS ---

  // Xử lý thêm lớp vào danh sách tạm
  const handleAddClassToList = () => {
    if (!currentClassInput.subjectId || !currentClassInput.enrollClass || !currentClassInput.semester) {
        alert("Vui lòng chọn Học kỳ, Môn học và nhập tên Lớp!");
        return;
    }
    // Kiểm tra trùng môn
    const exists = addedClasses.find(c => c.subjectId === currentClassInput.subjectId && c.semester === currentClassInput.semester);
    if (exists) {
        alert("Môn này trong học kỳ này đã được thêm vào danh sách rồi!");
        return;
    }

    setAddedClasses([...addedClasses, currentClassInput]);
    // Reset input lớp (giữ lại học kỳ cho tiện)
    setCurrentClassInput(prev => ({...prev, subjectId: '', enrollClass: ''}));
  };

  // Xóa lớp khỏi danh sách tạm
  const handleRemoveClassFromList = (index) => {
    const newList = [...addedClasses];
    newList.splice(index, 1);
    setAddedClasses(newList);
  };

  // SUBMIT TỔNG (Đã sửa để hỗ trợ vòng lặp)
  const handleSubmit = async (endpoint, data) => {
    try {
        // LOGIC RIÊNG CHO TAB NHẬP HỌC (ENROLL)
        if (activeTab === 'enroll') {
            if (addedClasses.length === 0) {
                alert("⚠️ Vui lòng thêm ít nhất 1 môn học vào danh sách!");
                return;
            }

            let successCount = 0;
            // Duyệt qua từng môn trong danh sách và gọi API
            for (const cls of addedClasses) {
                // Ghép thông tin SV + Thông tin lớp thành 1 payload
                const payload = {
                    ...studentInfoForm,
                    semester: cls.semester,
                    subjectId: cls.subjectId,
                    enrollClass: cls.enrollClass
                };

                console.log("Sending payload:", payload);
                await axios.post(`http://localhost:8000/api/v1/${endpoint}`, payload);
                successCount++;
            }
            alert(`✅ Đã nhập học thành công cho SV ${studentInfoForm.fullName} vào ${successCount} lớp!`);
            setAddedClasses([]); // Reset danh sách sau khi thành công
        } 
        // LOGIC CÁC TAB KHÁC (GIỮ NGUYÊN)
        else {
            await axios.post(`http://localhost:8000/api/v1/${endpoint}`, data);
            alert("✅ Thành công!");
        }
        
        fetchTableData();
    } catch (err) { 
        console.error(err);
        alert("❌ Lỗi: " + (err.response?.data?.detail || err.message)); 
    }
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

  const handleViewDetail = async (row) => {
    setViewStudentData(row);
    setIsViewModalOpen(true);
    setStudentEnrollments([]); // Reset danh sách môn cũ

    // Gọi API lấy danh sách môn học của SV này (Giả sử endpoint này tồn tại)
    // Nếu chưa có backend, nó sẽ chỉ hiện thông tin cá nhân
    try {
        // Lưu ý: Bạn cần thay đổi đường dẫn này khớp với backend của bạn
        // Ví dụ: GET /api/v1/view/enrollments?student_id=xxx
        const res = await axios.get(`http://localhost:8000/api/v1/view/classes?studentId=${row.ID}`);
        setStudentEnrollments(res.data);
    } catch (err) {
        console.log("Chưa có API lấy lịch sử học hoặc lỗi: ", err);
    }
  };

  // --- STYLES ---
  const containerStyle = { padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' };
  const inputStyle = { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%', boxSizing: 'border-box' };
  const btnStyle = { padding:'10px', background: '#28a745', color: '#fff', border: 'none', borderRadius:'4px', cursor: 'pointer', marginTop:'10px', width:'100%', fontWeight: 'bold' };
  const tabBtnStyle = (isActive) => ({ padding: '10px 20px', cursor: 'pointer', border: 'none', background: isActive ? '#007bff' : '#ddd', color: isActive ? '#fff' : '#000', borderRadius: '5px', marginRight:'5px' });
  const smallBtnStyle = { padding: '5px 10px', background: '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' };

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
            {/* PHẦN 1: THÔNG TIN SINH VIÊN */}
            <h5 style={{marginBottom: '10px', borderBottom: '1px solid #ccc'}}>A. Thông tin Sinh viên</h5>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginBottom: '15px'}}>
              <input placeholder="MSSV Mới (VD: 3001)" value={studentInfoForm.id} onChange={e=>setStudentInfoForm({...studentInfoForm, id: e.target.value})} style={inputStyle}/>
              <input placeholder="Họ tên" value={studentInfoForm.fullName} onChange={e=>setStudentInfoForm({...studentInfoForm, fullName: e.target.value})} style={inputStyle}/>
              <input placeholder="Email" value={studentInfoForm.email} onChange={e=>setStudentInfoForm({...studentInfoForm, email: e.target.value})} style={inputStyle}/>
              <input placeholder="Username" value={studentInfoForm.username} onChange={e=>setStudentInfoForm({...studentInfoForm, username: e.target.value})} style={inputStyle}/>
              <input placeholder="Password" type="password" value={studentInfoForm.password} onChange={e=>setStudentInfoForm({...studentInfoForm, password: e.target.value})} style={inputStyle}/>
              
              <select value={studentInfoForm.adminId} onChange={e=>setStudentInfoForm({...studentInfoForm, adminId: e.target.value})} style={inputStyle}>
                  <option value="">-- Admin Giám sát --</option>
                  {options.admins.map(a => <option key={a.id} value={a.id}>{a.name} ({a.id})</option>)}
              </select>

              <select value={studentInfoForm.facultyId} onChange={e=>setStudentInfoForm({...studentInfoForm, facultyId: e.target.value})} style={inputStyle}>
                  <option value="">-- Chọn Khoa --</option>
                  {options.faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>

              <input placeholder="Lớp Sinh hoạt (VD: CNTT1)" value={studentInfoForm.className} onChange={e=>setStudentInfoForm({...studentInfoForm, className: e.target.value})} style={inputStyle}/>
            </div>

            {/* PHẦN 2: CHỌN CÁC LỚP HỌC PHẦN */}
            <h5 style={{marginBottom: '10px', borderBottom: '1px solid #ccc'}}>B. Đăng ký Môn học (Thêm nhiều môn để tránh lỗi Trigger)</h5>
            <div style={{display:'flex', gap:'10px', alignItems:'center', background: '#e9ecef', padding: '10px', borderRadius: '5px'}}>
               <select value={currentClassInput.semester} onChange={e=>setCurrentClassInput({...currentClassInput, semester: e.target.value})} style={{...inputStyle, flex: 1}}>
                  <option value="">-- Học kỳ --</option>
                  {options.semesters.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              
              <select value={currentClassInput.subjectId} onChange={e=>setCurrentClassInput({...currentClassInput, subjectId: e.target.value})} style={{...inputStyle, flex: 2}}>
                  <option value="">-- Chọn Môn --</option>
                  {options.subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
              </select>

              <input placeholder="Lớp HP (VD: L01)" value={currentClassInput.enrollClass} onChange={e=>setCurrentClassInput({...currentClassInput, enrollClass: e.target.value})} style={{...inputStyle, flex: 1}}/>
              
              <button onClick={handleAddClassToList} style={smallBtnStyle}>➕ Thêm môn</button>
            </div>

            {/* DANH SÁCH CÁC MÔN ĐÃ CHỌN */}
            {addedClasses.length > 0 && (
                <div style={{marginTop: '10px', background: '#fff', border: '1px solid #ddd', padding: '10px'}}>
                    <strong>Danh sách môn sẽ đăng ký:</strong>
                    <ul style={{marginTop: '5px', paddingLeft: '20px'}}>
                        {addedClasses.map((cls, idx) => (
                            <li key={idx} style={{marginBottom: '5px'}}>
                                <b>{cls.semester}</b> - Môn ID: <b>{cls.subjectId}</b> - Lớp: <b>{cls.enrollClass}</b>
                                <span 
                                    onClick={() => handleRemoveClassFromList(idx)} 
                                    style={{marginLeft: '10px', color: 'red', cursor: 'pointer', fontWeight: 'bold'}}
                                >
                                    (Xóa)
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button style={btnStyle} onClick={() => handleSubmit('enrollment/student', null)}>🚀 Thực thi SP Nhập Học (Batch Insert)</button>
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

      {/* DATA VIEW TABLE */}
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
                            <td style={{padding:'8px', display: 'flex'}}>
                                <button onClick={()=>handleViewDetail(row)} style={{marginRight:'5px', cursor:'pointer', border:'none', background:'transparent', fontSize:'16px'}} title="Xem chi tiết">👁️</button>
                                <button onClick={()=>handleEditClick(row)} style={{marginRight:'5px'}}>✏️</button>
                                <button onClick={()=>handleDeleteUser(row.ID)} style={{color:'red'}}>🗑️</button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
      
      {/* Modal Edit */}
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

      {isViewModalOpen && viewStudentData && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.6)', display:'flex', justifyContent:'center', alignItems:'center', zIndex: 1000}}>
            <div style={{background:'white', padding:'25px', width:'600px', borderRadius:'8px', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 4px 6px rgba(0,0,0,0.1)'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #ddd', paddingBottom:'10px', marginBottom:'15px'}}>
                    <h3 style={{margin:0, color:'#007bff'}}>📄 Hồ sơ Sinh viên</h3>
                    <button onClick={()=>setIsViewModalOpen(false)} style={{background:'transparent', border:'none', fontSize:'20px', cursor:'pointer'}}>✖</button>
                </div>

                {/* Phần 1: Thông tin cá nhân */}
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'20px'}}>
                    <div><strong>MSSV:</strong> {viewStudentData.ID}</div>
                    <div><strong>Họ tên:</strong> {viewStudentData.Name || viewStudentData.FullName}</div>
                    <div><strong>Email:</strong> {viewStudentData.Email}</div>
                    <div><strong>Lớp SH:</strong> {viewStudentData.Class || 'N/A'}</div>
                    <div><strong>Khoa:</strong> {viewStudentData.Faculty || 'N/A'}</div>
                    <div><strong>Chương trình:</strong> {viewStudentData.Program || 'Chính quy'}</div>
                </div>

                {/* Phần 2: Danh sách môn học (Nếu có API trả về) */}
                <h4 style={{borderBottom:'2px solid #28a745', paddingBottom:'5px', marginBottom:'10px'}}>📚 Lịch sử đăng ký môn học</h4>
                
                {studentEnrollments.length > 0 ? (
                    <table style={{width:'100%', borderCollapse:'collapse', fontSize:'14px'}}>
                        <thead>
                            <tr style={{background:'#f8f9fa'}}>
                                <th style={{border:'1px solid #ddd', padding:'8px'}}>Học kỳ</th>
                                <th style={{border:'1px solid #ddd', padding:'8px'}}>Môn học</th>
                                <th style={{border:'1px solid #ddd', padding:'8px'}}>Lớp HP</th>
                                <th style={{border:'1px solid #ddd', padding:'8px'}}>Điểm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentEnrollments.map((enr, idx) => (
                                <tr key={idx}>
                                    <td style={{border:'1px solid #ddd', padding:'8px', textAlign:'center'}}>{enr.Semester || enr['Tên học kì']}</td>
                                    <td style={{border:'1px solid #ddd', padding:'8px'}}>{enr.SubjectName || enr['Mã môn học']}</td>
                                    <td style={{border:'1px solid #ddd', padding:'8px', textAlign:'center'}}>{enr.ClassName || enr['Tên lớp']}</td>
                                    <td style={{border:'1px solid #ddd', padding:'8px', textAlign:'center', fontWeight:'bold'}}>
                                        {enr.Grade !== null ? enr.Grade : <span style={{color:'gray'}}>--</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{fontStyle:'italic', color:'#666', textAlign:'center', padding:'20px', background:'#f1f1f1'}}>
                        Chưa có dữ liệu môn học hoặc chưa kết nối API chi tiết.
                    </p>
                )}

                <div style={{textAlign:'right', marginTop:'20px'}}>
                    <button onClick={()=>setIsViewModalOpen(false)} style={{padding:'10px 20px', background:'#6c757d', color:'white', border:'none', borderRadius:'4px', cursor:'pointer'}}>Đóng</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProcedureDemoPage;