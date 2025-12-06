from fastapi import APIRouter, HTTPException, Query
from ....db.session import get_db_connection
from ....models.assignment_model import AssignmentCreate, AssignmentSearch

router = APIRouter()

# 1. Lấy danh sách bài tập của một lớp cụ thể
@router.post("/assignments/search")
def get_assignments_by_class(filter: AssignmentSearch):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # [TODO] Query: SELECT * FROM BAI_TAP WHERE TenHocKi=? AND MaMonHoc=? AND TenLop=?
        sql_query = "" 
        
        if sql_query:
            cursor.execute(sql_query, (filter.semesterName, filter.subjectId, filter.className))
            columns = [column[0] for column in cursor.description]
            results = []
            for row in cursor.fetchall():
                results.append(dict(zip(columns, row)))
            return results
        
        return [] # Mock data rỗng
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# 2. Tạo bài tập mới
@router.post("/assignments/create")
def create_assignment(item: AssignmentCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # [TODO] Query: INSERT INTO BAI_TAP (TenHocKi, MaMonHoc, TenLop, MaBaiTap, TenBai, MoTa, HinhThuc, TuyChon, TG_BatDau, TG_KetThuc) ...
        sql_query = "" 
        
        if sql_query:
            cursor.execute(sql_query, (
                item.semesterName, item.subjectId, item.className, item.id,
                item.name, item.description, item.format, item.option,
                item.startDate, item.endDate
            ))
            conn.commit()
            return {"message": "Tạo bài tập thành công"}
        return {"message": "Đã nhận dữ liệu (Chưa SQL)"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# 3. Xóa bài tập (Cần đủ 4 khóa chính)
@router.delete("/assignments/delete")
def delete_assignment(
    semester: str = Query(...), 
    subject: str = Query(...), 
    classname: str = Query(...),
    id: str = Query(...)
):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # [TODO] Query: DELETE FROM BAI_TAP WHERE TenHocKi=? AND MaMonHoc=? AND TenLop=? AND MaBaiTap=?
        sql_query = "" 
        
        if sql_query:
            cursor.execute(sql_query, (semester, subject, classname, id))
            conn.commit()
            return {"message": "Xóa bài tập thành công"}
        return {"message": "Chưa có SQL Xóa"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()