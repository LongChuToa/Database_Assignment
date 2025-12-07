from pydantic import BaseModel

class ClassModel(BaseModel):
    semester: str       # Tên học kì (VD: HK1-2023)
    subjectId: int      # Mã môn học (VD: 201)
    className: str      # Tên lớp (VD: L01)
    lecturerId: int     # Mã giảng viên (VD: 1001)
    day: str            # Thứ (VD: 2, 3, 4...)
    time: str           # Giờ học (VD: 07:30:00)
    location: str       # Địa điểm (VD: A101)