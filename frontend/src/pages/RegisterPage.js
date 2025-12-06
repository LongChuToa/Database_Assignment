import React, { useState } from 'react';
import axios from 'axios';

const RegisterPage = ({ onBack }) => {
  const [formData, setFormData] = useState({
    id: '',             // Mapping: Ma (NGUOI_DUNG)
    fullName: '',       // Mapping: Ho va ten
    email: '',          // Mapping: Email
    address: '',        // Mapping: Dia chi
    username: '',       // Mapping: Ten dang nhap
    password: ''        // Mapping: Mat khau
  });
  
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      // Gọi API Đăng ký (Backend cần insert vào NGUOI_DUNG và SINH_VIEN với dữ liệu default)
      await axios.post('http://localhost:8000/api/v1/auth/register', formData);
      setMessage({ type: 'success', text: '✅ Đăng ký thành công! Vui lòng quay lại đăng nhập.' });
    } catch (err) {
      setMessage({ type: 'error', text: '❌ ' + (err.response?.data?.detail || "Lỗi hệ thống") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{width: '500px', textAlign:'left'}}>
        <h3 style={{textAlign:'center', color: '#034ea2'}}>Đăng Ký Tài Khoản</h3>
        
        {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Mã Số Sinh Viên (ID) *:</label>
              <input className="input-control" required placeholder="VD: 2310001"
                onChange={e => setFormData({...formData, id: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Họ và Tên *:</label>
              <input className="input-control" required placeholder="Nguyễn Văn A"
                onChange={e => setFormData({...formData, fullName: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label>Email Trường (*):</label>
            <input type="email" className="input-control" required placeholder="email@hcmut.edu.vn"
              onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="form-group">
            <label>Địa Chỉ:</label>
            <input className="input-control" placeholder="Nhập địa chỉ liên hệ"
              onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>

          <hr style={{margin:'15px 0', border:0, borderTop:'1px solid #eee'}} />

          <div className="form-row">
            <div className="form-group">
              <label>Tên Đăng Nhập *:</label>
              <input className="input-control" required 
                onChange={e => setFormData({...formData, username: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Mật Khẩu *:</label>
              <input type="password" className="input-control" required 
                onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="btn btn-success" style={{width: '100%', marginTop: '20px'}} disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>
        </form>

        <button className="btn-link" onClick={onBack} style={{marginTop: '15px', display:'block', margin:'0 auto', border:'none', background:'none', cursor:'pointer', color:'#666'}}>
          ← Quay lại Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;