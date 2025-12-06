from pydantic import BaseModel
from typing import Optional

# Model để tạo/sửa bài tập
class AssignmentCreate(BaseModel):
    # --- Khóa ngoại trỏ về LỚP HỌC (3 cột) ---
    semesterName: str   # Tên học kì
    subjectId: str      # Mã môn học
    className: str      # Tên lớp
    
    # --- Thông tin BÀI TẬP ---
    id: str             # Mã bài tập (PK thứ 4)
    name: str           # Tên bài
    description: Optional[str] = None # Mô tả
    format: str         # Hình thức làm bài (Tự luận/Trắc nghiệm)
    option: Optional[str] = None # Tùy chọn (VD: Cho nộp trễ)
    startDate: str      # Thời gian bắt đầu
    endDate: str        # Thời gian kết thúc

# Model để tìm kiếm bài tập (Thường tìm theo Lớp)
class AssignmentSearch(BaseModel):
    semesterName: str
    subjectId: str
    className: str