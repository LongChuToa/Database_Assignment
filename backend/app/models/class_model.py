from pydantic import BaseModel
from typing import Optional

# Dữ liệu để tạo lớp học (Khớp với bảng LOP_HOC trong ảnh)
class ClassCreate(BaseModel):
    semesterName: str   # Tên học kì (PK)
    subjectId: str      # Mã môn học (PK)
    className: str      # Tên lớp (PK)
    lecturerId: str     # Mã giảng viên (FK từ GIANG_VIEN -> EDU_MEMBER)
    time: str           # Thời gian
    location: str       # Địa điểm

# Dữ liệu tìm kiếm
class ClassSearch(BaseModel):
    keyword: Optional[str] = None
    semester: Optional[str] = None