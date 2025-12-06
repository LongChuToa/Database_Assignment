// src/frontend/src/pages/UserInfoPage.js
import React from 'react';

const UserInfoPage = ({ user }) => {
  return (
    <div className="page-wrapper">
      <h2 className="header-title">Thông Tin Người Dùng</h2>
      
      <div className="card profile-card">
        <div className="profile-header">
          <div className="avatar-large">{user.avatar}</div>
          <div>
            <h3>{user.name}</h3>
            <span className={`badge-role ${user.role}`}>{user.role}</span>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <label>Mã số định danh:</label>
            <strong>{user.id}</strong>
          </div>
          <div className="detail-row">
            <label>Email trường:</label>
            <strong>{user.email}</strong>
          </div>
          <div className="detail-row">
            <label>Đơn vị quản lý:</label>
            <strong>Khoa Khoa học & Kỹ thuật Máy tính</strong>
          </div>
          
          {/* Hiển thị thêm thông tin tùy role */}
          {user.role === 'STUDENT' && (
             <div className="detail-row">
               <label>Niên khóa:</label>
               <strong>K2023</strong>
             </div>
          )}
           {user.role === 'LECTURER' && (
             <div className="detail-row">
               <label>Học vị:</label>
               <strong>Thạc sĩ</strong>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoPage;