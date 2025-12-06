from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    username: str
    password: str

# Model Đăng ký Tinh gọn (Chỉ chứa thông tin quan trọng)
class RegisterRequest(BaseModel):
    id: int             # MSSV (Làm khóa chính)
    fullName: str       # Họ và tên
    email: str          # Email
    username: str       # Tên đăng nhập
    password: str       # Mật khẩu