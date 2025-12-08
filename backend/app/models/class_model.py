# src/backend/app/models/class_model.py
from pydantic import BaseModel

class ClassModel(BaseModel):
    semester: str       # Tên học kì
    subjectId: int      # Mã môn học
    className: str      # Tên lớp
    lecturerId: int     # Mã giảng viên
    day: str            # Thứ (2, 3, 4...)
    time: str           # Giờ học
    location: str       # Địa điểm
    
    # --- THÊM DÒNG NÀY ĐỂ SỬA LỖI ---
    firstStudentId: int # Mã sinh viên đầu tiên (Bắt buộc do Trigger DB)