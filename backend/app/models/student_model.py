from pydantic import BaseModel
from typing import Optional

class StudentCreate(BaseModel):
    # Phần của NGUOI_DUNG
    id: str             # Mã (Khóa chính)
    email: str
    username: str       # Tên đăng nhập
    password: str
    fullName: str       # Họ và tên
    address: Optional[str] = None # Địa chỉ
    
    # Phần của SINH_VIEN
    class_name: str     # Lớp (Sinh hoạt)
    program: str        # Chương trình
    cohort: str         # Niên khóa
    facultyId: str      # Mã khoa

class StudentSearch(BaseModel):
    keyword: Optional[str] = None
    faculty: Optional[str] = None