import React, { useState } from 'react';
import './App.css';
import ProcedureDemoPage from './pages/ProcedureDemoPage';
import FunctionPage from './pages/FunctionPage';
import GradeManagementPage from './pages/GradeManagementPage';

function App() {
  const [tab, setTab] = useState('proc'); 

  const btnStyle = (isActive) => ({
    display: 'block', width: '100%', padding: '12px', marginTop: '10px',
    textAlign: 'left', background: isActive ? '#34495e' : 'transparent',
    border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px', fontSize: '14px'
  });

  return (
    <div className="app-container" style={{display:'flex', height:'100vh'}}>
      {/* SIDEBAR */}
      <div style={{width:'240px', background:'#2c3e50', color:'white', padding:'20px', display:'flex', flexDirection:'column'}}>
        <h3 style={{marginBottom:'30px', borderBottom:'1px solid #7f8c8d', paddingBottom:'10px'}}>BK-LMS DB</h3>
        
        <button onClick={() => setTab('grades')} style={btnStyle(tab === 'grades')}>
            📊 Quản Lý Điểm
        </button>

        <button onClick={() => setTab('proc')} style={btnStyle(tab === 'proc')}>
            ⚙️ Tổng hợp Procedure
        </button>

        <button onClick={() => setTab('func')} style={btnStyle(tab === 'func')}>
            🔮 Tiện ích Functions (New)
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div style={{flex:1, padding:'20px', overflowY:'auto', background:'#f4f6f9'}}>
        {tab === 'grades' && <GradeManagementPage />}
        {tab === 'proc' && <ProcedureDemoPage />}
        {tab === 'func' && <FunctionPage />}
      </div>
    </div>
  );
}

export default App;