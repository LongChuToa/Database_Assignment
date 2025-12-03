// src/frontend/src/App.js
import React, { useState } from 'react';
import './App.css';
import CRUDPage from './pages/CRUDPage';
import ListPage from './pages/ListPage';
import ReportPage from './pages/ReportPage';

function App() {
  const [activeTab, setActiveTab] = useState('list');

  const renderContent = () => {
    switch (activeTab) {
      case 'crud':
        return <CRUDPage />; // Câu 3.1
      case 'list':
        return <ListPage onEdit={() => setActiveTab('crud')} />; // Câu 3.2
      case 'report':
        return <ReportPage />; // Câu 3.3
      default:
        return <ListPage />;
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="brand">
          BK-LMS ADMIN
          <div style={{fontSize: '12px', fontWeight: 'normal', marginTop: '5px', opacity: 0.7}}>
            Khoa KH&KT Máy Tính
          </div>
        </div>
        
        <button 
          className={`nav-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          📂 Danh sách Lớp Học (3.2)
        </button>
        <button 
          className={`nav-btn ${activeTab === 'crud' ? 'active' : ''}`}
          onClick={() => setActiveTab('crud')}
        >
          ➕ Mở Lớp / Đăng Ký (3.1)
        </button>
        <button 
          className={`nav-btn ${activeTab === 'report' ? 'active' : ''}`}
          onClick={() => setActiveTab('report')}
        >
          📊 Thống kê & Điểm (3.3)
        </button>
      </div>

      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;