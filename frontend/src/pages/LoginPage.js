// src/frontend/src/pages/LoginPage.js
import React from 'react';

const LoginPage = ({ onLogin }) => {
  // Dữ liệu giả lập cho các vai trò (Hardcode để demo)
  const mockUsers = {
    admin: {
      id: 'ADMIN01',
      name: 'Quản Trị Viên Hệ Thống',
      role: 'ADMIN',
      email: 'admin@hcmut.edu.vn',
      avatar: '🛡️'
    },
    lecturer: {
      id: 'GV001',
      name: 'ThS. Dương Huỳnh Anh Đức',
      role: 'LECTURER',
      email: 'dhaduc@hcmut.edu.vn',
      avatar: '👨‍🏫'
    },
    student: {
      id: '2310744',
      name: 'Trần Phương Đỉnh',
      role: 'STUDENT',
      email: 'dinh.tran@hcmut.edu.vn',
      avatar: '🎓'
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-logo">BK-LMS</div>
        <h3>Hệ Thống Quản Lý Học Tập</h3>
        <p style={{color: '#666', marginBottom: '30px'}}>
          Vui lòng chọn vai trò để đăng nhập (Demo Mode)
        </p>

        <div className="login-options">
          <button className="btn-login admin" onClick={() => onLogin(mockUsers.admin)}>
            <div className="icon">🛡️</div>
            <div>
              <strong>Quản Trị Viên</strong>
              <span>Toàn quyền hệ thống</span>
            </div>
          </button>

          <button className="btn-login lecturer" onClick={() => onLogin(mockUsers.lecturer)}>
            <div className="icon">👨‍🏫</div>
            <div>
              <strong>Giảng Viên</strong>
              <span>Quản lý lớp & Nhập điểm</span>
            </div>
          </button>

          <button className="btn-login student" onClick={() => onLogin(mockUsers.student)}>
            <div className="icon">🎓</div>
            <div>
              <strong>Sinh Viên</strong>
              <span>Xem lịch & Tra cứu điểm</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;