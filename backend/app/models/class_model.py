# src/backend/app/models/class_model.py
from pydantic import BaseModel
from typing import Optional

# Dữ liệu khi tạo lớp học mới (Khớp với form bên Frontend)
class ClassCreate(BaseModel):
    subjectId: str      # Mã môn học
    classCode: str      # Mã lớp
    semester: str       # Học kỳ
    lecturerId: str     # Mã giảng viên
    schedule: str       # Lịch học
    maxStudents: int    # Sỉ số

# Dữ liệu dùng cho tìm kiếm
class ClassSearch(BaseModel):
    keyword: Optional[str] = None
    semester: Optional[str] = None