from pydantic import BaseModel
from typing import Optional

# 1. Model cho NGƯỜI DÙNG (Khớp sp_insert_user)
class UserDTO(BaseModel):
    id: int
    email: str
    username: str
    password: str
    fullName: str
    address: str

# Model cho Update User (Khớp sp_update_user)
class UserUpdateDTO(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    fullName: Optional[str] = None
    address: Optional[str] = None

# 2. Model cho Quy trình Nhập học (Kết hợp nhiều bảng)
class StudentEnrollmentDTO(BaseModel):
    # Thông tin User
    id: int
    email: str
    username: str
    password: str
    fullName: str
    address: str
    
    # Thông tin Giám sát (Cho insert_edumember)
    adminId: int
    
    # Thông tin Sinh viên & Lớp (Cho insert_sinhvien_hoc)
    className: str      # Lớp sinh hoạt
    program: str        # Chương trình
    cohort: int         # Niên khóa
    facultyId: str      # Mã khoa
    semester: str       # Tên học kì (Để đăng ký lớp)
    subjectId: int      # Mã môn
    enrollClass: str    # Tên lớp học phần