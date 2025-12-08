from fastapi import APIRouter, HTTPException
from ....db.session import get_db_connection
from ....models.report_model import ReportRequest 

router = APIRouter()

@router.post("/reports/grades")
def get_class_grades(req: ReportRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # T-SQL Syntax: Join 3 bảng
        sql = """
            SELECT 
                sv.[Mã EDUMEMBER] AS MSSV, 
                nd.[Họ và tên], 
                h.[Điểm tổng kết], 
                h.[Trạng thái học]
            FROM [HỌC] h
            JOIN [Sinh viên] sv ON h.[Mã sinh viên] = sv.[Mã EDUMEMBER]
            JOIN [NGƯỜI DÙNG] nd ON sv.[Mã EDUMEMBER] = nd.[Mã]
            WHERE h.[Tên học kì] = ? 
              AND h.[Mã môn học] = ? 
              AND h.[Tên lớp] = ?
        """
        
        cursor.execute(sql, (req.semester, req.subjectId, req.className))
        
        # Convert to JSON
        columns = [column[0] for column in cursor.description]
        students = []
        for row in cursor.fetchall():
            students.append(dict(zip(columns, row)))
        
        total = len(students)
        passed = sum(1 for s in students if (s['Điểm tổng kết'] or 0) >= 5.0)
        
        return {
            "className": f"{req.className} - {req.subjectId}",
            "totalStudents": total,
            "passRate": f"{(passed/total)*100:.1f}%" if total > 0 else "0%",
            "avgScore": 0,
            "details": students
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()