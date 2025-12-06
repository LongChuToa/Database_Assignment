from fastapi import APIRouter, HTTPException, Query
from ....db.session import get_db_connection
from ....models.class_model import ClassCreate, ClassSearch

router = APIRouter()

# 1. Tìm kiếm lớp
@router.post("/classes/search")
def search_classes(filter: ClassSearch):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # [TODO] Query: SELECT * FROM LOP_HOC ...
        # Mapping: Cần JOIN với MON_HOC để lấy Tên Môn
        sql_query = "" 
        
        if sql_query:
            # Code thực thi...
            return [] # Mock
        return []
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# 2. Tạo lớp học (Insert vào bảng có 3 PK)
@router.post("/classes/create")
def create_class(item: ClassCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # [TODO] Query: INSERT INTO LOP_HOC (TenHocKi, MaMonHoc, TenLop, MaGiangVien, ThoiGian, DiaDiem) ...
        sql_query = "" 
        
        if sql_query:
            cursor.execute(sql_query, (
                item.semesterName, item.subjectId, item.className, 
                item.lecturerId, item.time, item.location
            ))
            conn.commit()
            return {"message": "Thêm lớp thành công"}
        return {"message": "API nhận dữ liệu thành công (Chưa có SQL)"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# 3. Xóa lớp học (Cần 3 tham số để định danh 1 lớp)
@router.delete("/classes/delete")
def delete_class(
    semester: str = Query(..., alias="semester"), 
    subject: str = Query(..., alias="subject"), 
    classname: str = Query(..., alias="classname")
):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # [TODO] Query: DELETE FROM LOP_HOC WHERE TenHocKi=? AND MaMonHoc=? AND TenLop=?
        sql_query = "" 
        
        if sql_query:
            cursor.execute(sql_query, (semester, subject, classname))
            conn.commit()
            return {"message": "Xóa thành công"}
        return {"message": "Chưa có SQL Xóa"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()