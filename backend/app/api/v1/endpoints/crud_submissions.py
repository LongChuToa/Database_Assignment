from fastapi import APIRouter, HTTPException
from datetime import datetime
from ....db.session import get_db_connection
from ....models.submission_model import SubmissionCreate, StudentAssignmentSearch

router = APIRouter()

# 1. Sinh viên Nộp bài
@router.post("/submissions/submit")
def submit_assignment(item: SubmissionCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Lấy thời gian hiện tại server
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # [TODO] Query: INSERT INTO THAM_GIA_LAM 
        # (MaSinhVien, TenHocKi, MaMonHoc, TenLop, MaBaiTap, ThoiGianNopBai, NoiDung, DiemSo)
        # Lưu ý: DiemSo mặc định là NULL (chưa chấm)
        sql_query = "" 
        
        if sql_query:
            cursor.execute(sql_query, (
                item.studentId, 
                item.semesterName, 
                item.subjectId, 
                item.className, 
                item.assignmentId, 
                current_time, 
                item.content
            ))
            conn.commit()
            return {"message": "Nộp bài thành công!", "time": current_time}
            
        return {"message": "Đã nhận bài làm (Chưa lưu DB)", "time": current_time}

    except Exception as e:
        conn.rollback()
        # Xử lý lỗi (VD: Đã nộp rồi -> Trùng khóa chính)
        msg = str(e)
        if "PRIMARY KEY" in msg:
            msg = "Bạn đã nộp bài cho bài tập này rồi."
        raise HTTPException(status_code=400, detail=msg)
    finally:
        conn.close()

# 2. Xem danh sách bài tập (Dành cho SV - Kèm trạng thái đã nộp chưa)
@router.post("/submissions/my-assignments")
def get_my_assignments(filter: StudentAssignmentSearch):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # [TODO] Query: SELECT BT.*, TGL.ThoiGianNopBai, TGL.DiemSo 
        # FROM BAI_TAP BT 
        # LEFT JOIN THAM_GIA_LAM TGL ON BT.MaBaiTap = TGL.MaBaiTap AND TGL.MaSinhVien = ?
        # WHERE BT.TenHocKi=? AND BT.MaMonHoc=? AND BT.TenLop=?
        sql_query = "" 
        
        if sql_query:
            # Cần truyền thêm student_id vào đây nếu query thật
            cursor.execute(sql_query, (filter.semesterName, filter.subjectId, filter.className))
            columns = [column[0] for column in cursor.description]
            results = []
            for row in cursor.fetchall():
                results.append(dict(zip(columns, row)))
            return results
        
        # Mock Data (Giả lập bài tập 1 đã nộp, bài 2 chưa)
        return [
            {
                "id": "BT01", "name": "Bài tập lớn số 1", "endDate": "2025-11-20 23:59",
                "isSubmitted": True, "score": 8.5, "submissionTime": "2025-11-19 10:00"
            },
            {
                "id": "BT02", "name": "Bài tập lớn số 2", "endDate": "2025-12-15 23:59",
                "isSubmitted": False, "score": None, "submissionTime": None
            }
        ]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()