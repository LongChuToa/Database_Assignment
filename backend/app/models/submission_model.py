from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Input: Dữ liệu nộp bài
class SubmissionCreate(BaseModel):
    # --- Định danh Sinh viên ---
    studentId: str      # MSSV
    
    # --- Định danh Bài tập (4 khóa chính) ---
    semesterName: str
    subjectId: str
    className: str
    assignmentId: str
    
    # --- Nội dung nộp ---
    content: str        # Nội dung bài làm (Text hoặc Link file)
    submissionTime: Optional[str] = None # Thời gian nộp (Backend tự lấy cũng được)

# Input: Tìm kiếm bài tập của sinh viên
class StudentAssignmentSearch(BaseModel):
    semesterName: str
    subjectId: str
    className: str