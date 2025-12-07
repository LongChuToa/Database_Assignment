import React, { useState } from 'react';
import './App.css';

// Chỉ import 2 trang chức năng chính
import ClassManagerPage from './pages/ClassManagerPage';
import GradeReportPage from './pages/GradeReportPage';

function App() {
  const [activeTab, setActiveTab] = useState('classes');

  const renderContent = () => {
    switch (activeTab) {
      case 'classes':
        return <ClassManagerPage />;
      case 'grades':
        return <GradeReportPage />;
      default:
        return <ClassManagerPage />;
    }
  };

  return (
    <div className="app-container" style={{display: 'flex', minHeight: '100vh'}}>
      {/* SIDEBAR ĐƠN GIẢN */}
      <div className="sidebar" style={{width: '250px', background: '#2c3e50', color: 'white', padding: '20px'}}>
        <div style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center', borderBottom: '1px solid #444', paddingBottom: '10px'}}>
          BK-LMS
          <div style={{fontSize: '12px', fontWeight: 'normal', color: '#ccc'}}>Phiên bản BTL2</div>
        </div>

        <button 
          onClick={() => setActiveTab('classes')}
          style={{
            display: 'block', width: '100%', padding: '15px', textAlign: 'left',
            background: activeTab === 'classes' ? '#34495e' : 'transparent',
            color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px'
          }}
        >
          📚 Quản Lý Lớp Học
        </button>

        <button 
          onClick={() => setActiveTab('grades')}
          style={{
            display: 'block', width: '100%', padding: '15px', textAlign: 'left',
            background: activeTab === 'grades' ? '#34495e' : 'transparent',
            color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px'
          }}
        >
          📊 Tra Cứu Điểm
        </button>
      </div>

      {/* NỘI DUNG CHÍNH */}
      <div className="main-content" style={{flex: 1, padding: '30px', background: '#f4f6f9'}}>
        {renderContent()}
      </div>
    </div>
  );
}

export default App;