import React, { useState } from 'react';
import axios from 'axios';

const StudentAssignmentPage = ({ currentUser }) => {
  const API_BASE_URL = 'http://localhost:8000/api/v1';

  // --- STATE 1: CHỌN LỚP ---
  const [filters, setFilters] = useState({
    semesterName: 'Học kỳ 1 Năm 2024-2025',
    subjectId: '',
    className: ''
  });

  // --- STATE 2: DANH SÁCH BÀI TẬP ---
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- STATE 3: FORM NỘP BÀI (MODAL) ---
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null); // Bài đang chọn để nộp
  const [submissionContent, setSubmissionContent] = useState('');

  // 1. Tải danh sách bài tập
  const fetchAssignments = async () => {
    if (!filters.subjectId || !filters.className) return alert("Vui lòng nhập thông tin lớp!");
    setLoading(true);
    try {
      // Gọi API lấy bài tập (kèm trạng thái nộp)
      const res = await axios.post(`${API_BASE_URL}/submissions/my-assignments`, filters);
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Mở Modal Nộp Bài
  const handleOpenSubmit = (assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionContent('');
    setShowModal(true);
  };

  // 3. Gửi Bài Làm
  const handleSubmit = async () => {
    if (!submissionContent) return alert("Vui lòng nhập nội dung bài làm!");
    
    try {
      const payload = {
        studentId: currentUser.id, // Lấy ID sinh viên đang đăng nhập
        semesterName: filters.semesterName,
        subjectId: filters.subjectId,
        className: filters.className,
        assignmentId: selectedAssignment.id,
        content: submissionContent
      };

      await axios.post(`${API_BASE_URL}/submissions/submit`, payload);
      alert("✅ Nộp bài thành công!");
      setShowModal(false);
      fetchAssignments(); // Reload lại để cập nhật trạng thái "Đã nộp"
    } catch (err) {
      alert("Lỗi nộp bài: " + (err.response?.data?.detail || "Lỗi server"));
    }
  };

  return (
    <div className="page-wrapper">
      <h2 className="header-title">Làm Bài Tập & Nộp Bài</h2>

      {/* FILTER BAR */}
      <div className="card toolbar" style={{background:'#e8f5e9', border:'1px solid #c8e6c9'}}>
        <div className="form-row" style={{marginBottom:0, alignItems:'flex-end'}}>
          <div style={{flex:1.5}}>
             <label>Học Kỳ:</label>
             <select className="input-control" value={filters.semesterName} onChange={e => setFilters({...filters, semesterName: e.target.value})}>
                <option>Học kỳ 1 Năm 2024-2025</option>
                <option>Học kỳ 2 Năm 2024-2025</option>
             </select>
          </div>
          <div style={{flex:1}}>
             <label>Mã Môn:</label>
             <input className="input-control" placeholder="VD: CO2013" value={filters.subjectId} onChange={e => setFilters({...filters, subjectId: e.target.value})} />
          </div>
          <div style={{flex:1}}>
             <label>Tên Lớp:</label>
             <input className="input-control" placeholder="VD: L01" value={filters.className} onChange={e => setFilters({...filters, className: e.target.value})} />
          </div>
          <button className="btn btn-primary" onClick={fetchAssignments}>📂 Mở Lớp</button>
        </div>
      </div>

      {/* DANH SÁCH BÀI TẬP */}
      <div className="card">
        <h4 style={{marginTop:0}}>Danh sách Bài tập cần làm</h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã Bài</th>
              <th>Tên Bài Tập</th>
              <th>Hạn Nộp</th>
              <th>Trạng Thái</th>
              <th>Điểm</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length > 0 ? assignments.map(asg => (
              <tr key={asg.id}>
                <td>{asg.id}</td>
                <td style={{fontWeight:500}}>{asg.name}</td>
                <td style={{color:'#d35400'}}>{asg.endDate}</td>
                
                {/* Trạng thái nộp */}
                <td>
                  {asg.isSubmitted 
                    ? <span className="status-pass">Đã nộp ({asg.submissionTime})</span>
                    : <span className="status-fail" style={{color:'#7f8c8d'}}>Chưa nộp</span>
                  }
                </td>

                {/* Điểm số */}
                <td>
                  {asg.score !== null && asg.score !== undefined 
                    ? <span className="badge-score">{asg.score}</span> 
                    : '--'}
                </td>

                {/* Nút thao tác */}
                <td>
                  {!asg.isSubmitted ? (
                    <button className="btn-sm btn-primary" onClick={() => handleOpenSubmit(asg)}>
                      📝 Làm bài
                    </button>
                  ) : (
                    <button className="btn-sm btn-secondary" disabled style={{opacity:0.6}}>
                      Đã xong
                    </button>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>Chọn lớp để xem bài tập.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL NỘP BÀI */}
      {showModal && selectedAssignment && (
        <div className="modal-overlay">
          <div className="modal-content" style={{width: '600px'}}>
            <h3>Nộp Bài: {selectedAssignment.name}</h3>
            <div style={{marginBottom:'15px', padding:'10px', background:'#f8f9fa', borderRadius:'4px'}}>
               <strong>Đề bài/Mô tả:</strong><br/>
               {selectedAssignment.description || "(Không có mô tả chi tiết)"}
            </div>

            <div className="form-group">
               <label>Nội dung bài làm (Text hoặc Link Drive):</label>
               <textarea 
                  className="input-control" 
                  rows="5" 
                  placeholder="Nhập câu trả lời của bạn hoặc dán link Google Drive tại đây..."
                  value={submissionContent}
                  onChange={e => setSubmissionContent(e.target.value)}
               ></textarea>
            </div>

            <div className="actions">
               <button className="btn btn-success" onClick={handleSubmit}>🚀 Gửi Bài</button>
               <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignmentPage;