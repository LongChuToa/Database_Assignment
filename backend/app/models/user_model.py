from pydantic import BaseModel
from typing import Optional

# Model Update chứa TẤT CẢ các trường có thể sửa của cả SV và GV
class UserProfileUpdate(BaseModel):
    id: int             # Khóa chính để định danh
    fullName: str
    email: str
    address: Optional[str] = None
    
    # Trường riêng của SINH_VIEN
    className: Optional[str] = None
    program: Optional[str] = None
    
    # Trường riêng của GIANG_VIEN
    degree: Optional[str] = None    # Học vị
    title: Optional[str] = None     # Chức danh