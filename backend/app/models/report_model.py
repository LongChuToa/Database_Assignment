# src/backend/app/models/report_model.py
from pydantic import BaseModel
from typing import List, Optional

# Input: Người dùng chọn Lớp để xem báo cáo
class ReportInput(BaseModel):
    classId: str # Mã lớp (VD: L01)

# Chi tiết điểm của từng sinh viên (Dòng trong bảng)
class StudentGrade(BaseModel):
    id: str             # MSSV
    name: str           # Họ tên
    assignment: float   # Điểm BT
    exam: float         # Điểm Thi
    final: float        # Tổng kết (Tính từ Function SQL)

# Output: Tổng hợp báo cáo (Trả về cho Frontend)
class ClassReport(BaseModel):
    className: str
    totalStudents: int
    avgScore: float
    passRate: str       # Tỉ lệ qua môn (VD: "95%")
    details: List[StudentGrade] # Danh sách chi tiết