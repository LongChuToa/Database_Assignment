// src/frontend/src/pages/UserInfoPage.js
import React, { useState, useEffect } from 'react';

const UserInfoPage = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Form chứa tất cả các trường có thể có
  const [formData, setFormData] = useState({
    id: '', fullName: '', email: '', address: '', role: '',
    className: '', program: '', // Riêng cho SV
    degree: '', title: ''       // Riêng cho GV
  });

  // Khi component load hoặc user đổi, nạp dữ liệu vào form
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        fullName: user.name, // Lưu ý mapping key
        email: user.email,
        address: user.address || '',
        role: user.role,
        // Giả sử API login hoặc get_profile trả về thêm các trường này
        // Nếu API Login chưa trả về, bạn cần gọi thêm API get_detail_user
        className: user.className || '',
        program: user.program || '',
        degree: user.degree || '',
        title: user.title || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Gửi dữ liệu xuống Backend
    // Backend sẽ tự lọc: Nếu là SV thì update Lop, nếu là GV thì update HocVi
    onUpdate(formData); 
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset về dữ liệu gốc
    setFormData({
        id: user.id,
        fullName: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        className: user.className,
        program: user.program,
        degree: user.degree,
        title: user.title
    });
    setIsEditing(false);
  };

  return (
    <div className="page-wrapper">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h2 className="header-title" style={{marginBottom: 0, border: 'none'}}>Hồ Sơ Của Tôi</h2>
        {!isEditing ? (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>✏️ Chỉnh sửa</button>
        ) : (
          <div style={{display: 'flex', gap: '10px'}}>
            <button className="btn btn-success" onClick={handleSave}>💾 Lưu</button>
            <button className="btn btn-secondary" onClick={handleCancel}>Hủy</button>
          </div>
        )}
      </div>
      
      <div className="card profile-card">
        <div className="profile-header">
          <div className="avatar-large">{user.role === 'STUDENT' ? '🎓' : '👨‍🏫'}</div>
          <div style={{flex: 1}}>
            {isEditing ? (
               <input name="fullName" className="input-control" value={formData.fullName} onChange={handleChange} style={{fontSize: '1.2rem', fontWeight: 'bold'}} />
            ) : (
               <h3>{formData.fullName}</h3>
            )}
            <span className={`badge-role ${user.role}`}>{user.role}</span>
          </div>
        </div>

        <div className="profile-details">
          {/* --- PHẦN 1: THÔNG TIN CHUNG (NGUOI_DUNG) --- */}
          <div className="detail-row">
            <label>Mã số (ID):</label>
            <input className="input-control" value={formData.id} disabled style={{background: '#f9f9f9'}} />
          </div>
          <div className="detail-row">
            <label>Email:</label>
            {isEditing ? <input name="email" className="input-control" value={formData.email} onChange={handleChange} /> : <strong>{formData.email}</strong>}
          </div>
          <div className="detail-row">
            <label>Địa chỉ:</label>
            {isEditing ? <input name="address" className="input-control" value={formData.address} onChange={handleChange} /> : <strong>{formData.address || '(Chưa cập nhật)'}</strong>}
          </div>

          {/* --- PHẦN 2: THÔNG TIN RIÊNG (DỰA TRÊN ROLE) --- */}
          
          {/* Nếu là SINH VIÊN -> Hiện ô sửa Lớp, Chương trình */}
          {user.role === 'STUDENT' && (
            <>
              <h4 style={{marginTop: '20px', borderBottom: '1px solid #eee'}}>Thông Tin Học Vụ</h4>
              <div className="detail-row">
                <label>Lớp Sinh Hoạt:</label>
                {isEditing ? (
                  <input name="className" className="input-control" value={formData.className} onChange={handleChange} placeholder="VD: L01" />
                ) : (
                  <strong>{formData.className || 'Chưa xếp lớp'}</strong>
                )}
              </div>
              <div className="detail-row">
                <label>Chương Trình:</label>
                {isEditing ? (
                  <select name="program" className="input-control" value={formData.program} onChange={handleChange}>
                    <option value="Chính quy">Chính quy</option>
                    <option value="CLC">Chất lượng cao</option>
                  </select>
                ) : (
                  <strong>{formData.program}</strong>
                )}
              </div>
            </>
          )}

          {/* Nếu là GIẢNG VIÊN -> Hiện ô sửa Học vị, Chức danh */}
          {user.role === 'LECTURER' && (
            <>
              <h4 style={{marginTop: '20px', borderBottom: '1px solid #eee'}}>Thông Tin Chuyên Môn</h4>
              <div className="detail-row">
                <label>Học Vị:</label>
                {isEditing ? (
                  <input name="degree" className="input-control" value={formData.degree} onChange={handleChange} placeholder="Thạc sĩ / Tiến sĩ" />
                ) : (
                  <strong>{formData.degree || '---'}</strong>
                )}
              </div>
              <div className="detail-row">
                <label>Chức Danh:</label>
                {isEditing ? (
                  <input name="title" className="input-control" value={formData.title} onChange={handleChange} placeholder="Giảng viên chính..." />
                ) : (
                  <strong>{formData.title || '---'}</strong>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserInfoPage;