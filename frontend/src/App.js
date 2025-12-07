// src/frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// --- IMPORT CÁC TRANG (PAGES) ---
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserInfoPage from './pages/UserInfoPage';
import ClassManagerPage from './pages/ClassManagerPage';
import GradeReportPage from './pages/GradeReportPage';
import StudentManagerPage from './pages/StudentManagerPage';
import AssignmentManagerPage from './pages/AssignmentManagerPage';
import StudentAssignmentPage from './pages/StudentAssignmentPage';

function App() {
  // --- KHAI BÁO HOOKS ---
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [isRegistering, setIsRegistering] = useState(false);

  // --- HANDLERS ---
  const handleLogin = (user) => {
    setCurrentUser(user);
    setActiveTab('info');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsRegistering(false);
    setActiveTab('info');
  };

  const handleUpdateUser = async (updatedData) => {
    try {
      await axios.put('http://localhost:8000/api/v1/users/update', updatedData);
      const newUserState = {
          ...currentUser,
          ...updatedData,
          name: updatedData.fullName 
      };
      setCurrentUser(newUserState);
    } catch (err) {
      alert("Lỗi cập nhật: " + (err.response?.data?.detail || err.message));
    }
  };

  // --- LOGIC ĐIỀU HƯỚNG LOGIN/REGISTER ---
  if (!currentUser) {
    if (isRegistering) {
      return <RegisterPage onBack={() => setIsRegistering(false)} />;
    }
    return <LoginPage onLogin={handleLogin} onGoToRegister={() => setIsRegistering(true)} />;
  }

  // --- ROUTER NỘI DUNG CHÍNH ---
  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return <UserInfoPage user={currentUser} onUpdate={handleUpdateUser} />;
      case 'classes':
        return <ClassManagerPage currentUser={currentUser} />;
      case 'students':
        return <StudentManagerPage currentUser={currentUser} />;
      case 'assignments':
        return <AssignmentManagerPage currentUser={currentUser} />;
      case 'grades':
        return <GradeReportPage currentUser={currentUser} />;
      case 'student-assignments':
        return <StudentAssignmentPage currentUser={currentUser} />;
      default:
        return <UserInfoPage user={currentUser} onUpdate={handleUpdateUser} />;
    }
  };

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="brand">
          BK-LMS {currentUser.role}
          <div style={{fontSize: '11px', opacity: 0.7, marginTop: '5px'}}>
            Xin chào, {currentUser.name ? currentUser.name.split(' ').pop() : 'User'}
          </div>
        </div>

        <button className={`nav-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
          👤 Hồ Sơ Cá Nhân
        </button>
        
        {/* Menu cho ADMIN và GIẢNG VIÊN */}
        {(currentUser.role === 'ADMIN' || currentUser.role === 'LECTURER') && (
          <>
            <div className="menu-group">QUẢN LÝ ĐÀO TẠO</div>
            <button className={`nav-btn ${activeTab === 'classes' ? 'active' : ''}`} onClick={() => setActiveTab('classes')}>
              📚 Quản Lý Lớp Học
            </button>
            <button className={`nav-btn ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => setActiveTab('assignments')}>
              📝 Quản Lý Bài Tập
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
            <button className={`nav-btn ${activeTab === 'student-assignments' ? 'active' : ''}`} onClick={() => setActiveTab('student-assignments')}>
              📝 Làm Bài Tập
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

      {/* MAIN CONTENT AREA */}
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;