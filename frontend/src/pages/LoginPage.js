import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ onLogin, onGoToRegister }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- CẤU HÌNH TÀI KHOẢN DEBUG (HARDCODED) ---
  const DEBUG_ACCOUNTS = {
    'admin': {
      id: 9999,
      username: 'admin',
      name: 'Quản Trị Viên (Debug)',
      role: 'ADMIN',
      email: 'admin@hcmut.edu.vn',
      avatar: '🛡️'
    },
    'gv': {
      id: 8888,
      username: 'gv',
      name: 'Giảng Viên Test (Debug)',
      role: 'LECTURER',
      email: 'gv@hcmut.edu.vn',
      avatar: '👨‍🏫'
    },
    'sv': {
      id: 7777,
      username: 'sv',
      name: 'Sinh Viên Test (Debug)',
      role: 'STUDENT',
      email: 'sv@hcmut.edu.vn',
      avatar: '🎓',
      // Dữ liệu giả cho SV để test trang chỉnh sửa
      className: 'L01',
      program: 'Chính quy',
      cohort: '2023'
    }
  };
  // ---------------------------------------------

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 1. KIỂM TRA HARDCODE TRƯỚC (Bypass Logic)
    // Mật khẩu chung cho debug là "123"
    if (DEBUG_ACCOUNTS[credentials.username] && credentials.password === '123') {
      setTimeout(() => {
        alert(`🔓 Đang vào chế độ Debug: ${credentials.username.toUpperCase()}`);
        onLogin(DEBUG_ACCOUNTS[credentials.username]);
        setLoading(false);
      }, 500); // Giả vờ load 0.5s
      return;
    }

    // 2. NẾU KHÔNG PHẢI HARDCODE -> GỌI API THẬT
    try {
      const res = await axios.post('http://localhost:8000/api/v1/auth/login', credentials);
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Đăng nhập thất bại (Sai tên hoặc mật khẩu)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-logo">BK-LMS</div>
        <h3>Đăng Nhập Hệ Thống</h3>
        
        {/* Hint cho Developer */}
        <div style={{background: '#fff3cd', color: '#856404', padding: '10px', fontSize: '12px', marginBottom: '15px', borderRadius: '4px', textAlign: 'left'}}>
          <strong>🛠️ Debug Mode (Mật khẩu: 123):</strong><br/>
          - Admin: <code>admin</code><br/>
          - Giảng viên: <code>gv</code><br/>
          - Sinh viên: <code>sv</code>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{textAlign: 'left', marginTop: '20px'}}>
          <div className="form-group">
            <label>Tên đăng nhập:</label>
            <input 
              name="username" className="input-control" required 
              placeholder="Nhập 'admin', 'gv', hoặc 'sv'..."
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu:</label>
            <input 
              name="password" type="password" className="input-control" required 
              placeholder="Nhập '123' để test nhanh"
              onChange={handleChange}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}} disabled={loading}>
            {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
          </button>
        </form>

        <div style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px'}}>
          <span style={{color: '#666'}}>Chưa có tài khoản? </span>
          <button className="btn-link" onClick={onGoToRegister} style={{color: '#034ea2', fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer'}}>
            Đăng ký Sinh viên
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;