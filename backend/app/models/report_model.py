from pydantic import BaseModel

class ReportRequest(BaseModel):
    semester: str       # Tên học kì
    subjectId: int      # Mã môn học
    className: str      # Tên lớp