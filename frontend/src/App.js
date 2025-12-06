// src/frontend/src/App.js
import React, { useState } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import UserInfoPage from './pages/UserInfoPage';
import ClassManagerPage from './pages/ClassManagerPage';
import GradeReportPage from './pages/GradeReportPage';
import StudentManagerPage from './pages/StudentManagerPage'; 

function App() {
  // State lưu user hiện tại (null = chưa đăng nhập)
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  // Hàm xử lý đăng nhập
  const handleLogin = (user) => {
    setCurrentUser(user);
    setActiveTab('info'); // Vào là xem thông tin trước
  };

  // Hàm đăng xuất
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Nếu chưa đăng nhập, hiển thị trang Login
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Render nội dung chính
  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return <UserInfoPage user={currentUser} />;
      case 'classes':
        // Truyền user xuống để phân quyền nút bấm (View/Edit)
        return <ClassManagerPage currentUser={currentUser} />;
      case 'students':
        return <StudentManagerPage currentUser={currentUser} />;
      case 'grades':
        return <GradeReportPage currentUser={currentUser} />;
      default:
        return <UserInfoPage user={currentUser} />;
    }
  };

  return (
    <div className="app-container">
      {/* SIDEBAR ĐỘNG THEO QUYỀN */}
      <div className="sidebar">
        <div className="brand">
          BK-LMS {currentUser.role}
          <div style={{fontSize: '11px', opacity: 0.7, marginTop: '5px'}}>
            Xin chào, {currentUser.name.split(' ').pop()}
          </div>
        </div>

        <button className={`nav-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
          👤 Thông Tin Cá Nhân
        </button>
        
        {/* Menu cho ADMIN và GIẢNG VIÊN */}
        {(currentUser.role === 'ADMIN' || currentUser.role === 'LECTURER') && (
          <>
            <div className="menu-group">QUẢN LÝ</div>
            <button className={`nav-btn ${activeTab === 'classes' ? 'active' : ''}`} onClick={() => setActiveTab('classes')}>
              📚 Quản Lý Lớp Học
            </button>
            <button className={`nav-btn ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>
              🎓 Quản Lý Sinh Viên
            </button>
          </>
        )}

        {/* Menu cho SINH VIÊN */}
        {currentUser.role === 'STUDENT' && (
          <>
            <div className="menu-group">HỌC TẬP</div>
            <button className={`nav-btn ${activeTab === 'classes' ? 'active' : ''}`} onClick={() => setActiveTab('classes')}>
              📅 Thời Khóa Biểu
            </button>
          </>
        )}

        <div className="menu-group">BÁO CÁO</div>
        <button className={`nav-btn ${activeTab === 'grades' ? 'active' : ''}`} onClick={() => setActiveTab('grades')}>
          📊 Xem Bảng Điểm
        </button>

        <div style={{marginTop: 'auto', borderTop: '1px solid #34495e'}}>
          <button className="nav-btn" onClick={handleLogout} style={{color: '#e74c3c'}}>
            🚪 Đăng Xuất
          </button>
        </div>
      </div>

      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;