from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ....db.session import get_db_connection
from ....models.report_model import ReportRequest

router = APIRouter()


@router.post("/reports/grades")
def get_class_grades(req: ReportRequest):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # Query phức tạp: Lấy danh sách SV và Điểm trong lớp
        sql = """
            SELECT sv.`Mã EDUMEMBER` as MSSV, nd.`Họ và tên`, h.`Điểm tổng kết`, h.`Trạng thái học`
            FROM `HỌC` h
            JOIN `SINH VIÊN` sv ON h.`Mã sinh viên` = sv.`Mã EDUMEMBER`
            JOIN `NGƯỜI DÙNG` nd ON sv.`Mã EDUMEMBER` = nd.`Mã`
            WHERE h.`Tên học kì` = %s 
              AND h.`Mã môn học` = %s 
              AND h.`Tên lớp` = %s
        """
        cursor.execute(sql, (req.semester, req.subjectId, req.className))
        students = cursor.fetchall()
        
        # Tính toán thống kê đơn giản (Python tính cho nhanh, hoặc dùng SQL AVG)
        total = len(students)
        passed = sum(1 for s in students if (s['Điểm tổng kết'] or 0) >= 5)
        
        return {
            "className": f"{req.className} - {req.subjectId}",
            "totalStudents": total,
            "passRate": f"{(passed/total)*100:.1f}%" if total > 0 else "0%",
            "avgScore": 0, # Tạm để 0 hoặc tính trung bình
            "details": students
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()