from fastapi import APIRouter, HTTPException
from ....db.session import get_db_connection
# Import model từ file vừa tạo
from ....models.class_model import ClassModel 

router = APIRouter()



# --- API 1: TÌM KIẾM LỚP HỌC (Câu 3.2) ---
@router.post("/classes/search")
def search_classes(keyword: str = "", semester: str = ""):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True) # dictionary=True để trả về JSON đẹp
    try:
        # Query JOIN để lấy tên môn học cho đẹp
        sql = """
            SELECT lh.`Tên học kì`, lh.`Mã môn học`, mh.`Tên` as `Tên môn`, 
                   lh.`Tên lớp`, lh.`Mã giảng viên`, lh.`Thứ`, lh.`Giờ học`, lh.`Địa điểm`
            FROM `LỚP HỌC` lh
            JOIN `MÔN HỌC` mh ON lh.`Mã môn học` = mh.`Mã`
            WHERE 1=1
        """
        params = []
        
        if semester and semester != "All":
            sql += " AND lh.`Tên học kì` = %s"
            params.append(semester)
            
        if keyword:
            sql += " AND mh.`Tên` LIKE %s"
            params.append(f"%{keyword}%")

        cursor.execute(sql, params)
        return cursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# --- API 2: THÊM LỚP HỌC (Câu 3.1) ---
@router.post("/classes/create")
def create_class(item: ClassModel):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Gọi thẳng câu lệnh INSERT (Hoặc gọi Procedure insert_lophoc_hoc nếu muốn xịn hơn)
        sql = """
            INSERT INTO `LỚP HỌC` 
            (`Tên học kì`, `Mã môn học`, `Tên lớp`, `Mã giảng viên`, `Thứ`, `Giờ học`, `Địa điểm`)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (
            item.semester, item.subjectId, item.className, 
            item.lecturerId, item.day, item.time, item.location
        ))
        conn.commit()
        return {"message": "Thêm lớp thành công"}
    except Exception as e:
        conn.rollback()
        # Bắt lỗi trigger (VD: Lớp chưa có SV)
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# --- API 3: XÓA LỚP HỌC (Câu 3.1) ---
@router.delete("/classes/delete")
def delete_class(semester: str, subjectId: int, className: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        sql = "DELETE FROM `LỚP HỌC` WHERE `Tên học kì`=%s AND `Mã môn học`=%s AND `Tên lớp`=%s"
        cursor.execute(sql, (semester, subjectId, className))
        conn.commit()
        return {"message": "Xóa lớp thành công"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()