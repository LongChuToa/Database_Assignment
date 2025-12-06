# src/backend/app/models/student_model.py
from pydantic import BaseModel
from typing import Optional

# Input: Dữ liệu tìm kiếm (Từ thanh search bar)
class StudentSearch(BaseModel):
    keyword: Optional[str] = None
    faculty: Optional[str] = None

# Input: Dữ liệu khi tạo mới sinh viên (Khớp với form Modal)
class StudentCreate(BaseModel):
    id: str             # MSSV (Khóa chính)
    name: str           # Họ tên
    email: str          # Email
    dob: Optional[str] = None # Ngày sinh
    facultyId: str      # Mã khoa
    program: str        # Chương trình (Chính quy/CLC)
    cohort: str         # Niên khóa (2023)

# Output: Dữ liệu trả về để hiển thị lên bảng
class StudentResponse(BaseModel):
    id: str
    name: str
    email: str
    faculty: str
    program: str
    status: str