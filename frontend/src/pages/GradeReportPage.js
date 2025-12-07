import React, { useState } from 'react';
import axios from 'axios';

const GradeReportPage = () => {
  const [input, setInput] = useState({ semester: 'HK1-2023', subjectId: '', className: '' });
  const [data, setData] = useState(null);

  const handleView = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/v1/reports/grades', input);
      setData(res.data);
    } catch (err) { alert("Không tìm thấy dữ liệu lớp này!"); }
  };

  return (
    <div style={{padding: '20px'}}>
      <h2>Tra Cứu Bảng Điểm Lớp</h2>
      
      <div style={{marginBottom: '20px'}}>
        <select onChange={e => setInput({...input, semester: e.target.value})}>
            <option>HK1-2023</option>
            <option>HK2-2023</option>
        </select>
        <input placeholder="Mã Môn (VD: 201)" onChange={e => setInput({...input, subjectId: e.target.value})} />
        <input placeholder="Tên Lớp (VD: L01)" onChange={e => setInput({...input, className: e.target.value})} />
        <button onClick={handleView} style={{background: '#007bff', color: 'white'}}>Xem Báo Cáo</button>
      </div>

      {data && (
        <div>
            <h3>Lớp: {data.className}</h3>
            <p>Sĩ số: <b>{data.totalStudents}</b> | Tỉ lệ qua môn: <b>{data.passRate}</b></p>
            
            <table border="1" style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                    <tr style={{background: '#eee'}}>
                        <th>MSSV</th><th>Họ Tên</th><th>Trạng Thái</th><th>Điểm Tổng Kết</th>
                    </tr>
                </thead>
                <tbody>
                    {data.details.map(sv => (
                        <tr key={sv.MSSV}>
                            <td>{sv.MSSV}</td>
                            <td>{sv['Họ và tên']}</td>
                            <td>{sv['Trạng thái học']}</td>
                            <td style={{fontWeight: 'bold', color: sv['Điểm tổng kết'] >= 5 ? 'green' : 'red'}}>
                                {sv['Điểm tổng kết']}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
};

export default GradeReportPage;