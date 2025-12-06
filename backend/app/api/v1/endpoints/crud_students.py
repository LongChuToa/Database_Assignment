# src/backend/app/api/v1/endpoints/crud_students.py
from fastapi import APIRouter, HTTPException
from ....db.session import get_db_connection
from ....models.student_model import StudentSearch, StudentCreate

router = APIRouter()

# 1. API Tìm kiếm Sinh viên
@router.post("/students/search")
def search_students(filter: StudentSearch):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Lỗi kết nối DB")
    
    cursor = conn.cursor()
    try:
        # --- [TODO] --- VIẾT SQL GỌI THỦ TỤC TÌM KIẾM
        # Yêu cầu: Join bảng SINH_VIEN và NGUOI_DUNG để lấy Tên và Email
        # Ví dụ: EXEC sp_TimKiemSinhVien @Keyword=?, @Khoa=?
        sql_query = "" 
        
        if sql_query:
            cursor.execute(sql_query, (filter.keyword, filter.faculty))
            columns = [column[0] for column in cursor.description]
            results = []
            for row in cursor.fetchall():
                results.append(dict(zip(columns, row)))
            return results
        
        # [MOCK DATA] Trả về giả nếu chưa có SQL để Frontend không lỗi
        return []

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# 2. API Thêm Sinh viên mới (Câu 3.1)
@router.post("/students/create")
def create_student(item: StudentCreate):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Lỗi kết nối DB")
    
    cursor = conn.cursor()
    try:
        # --- [TODO] --- VIẾT SQL GỌI THỦ TỤC THÊM MỚI
        # Lưu ý: Thủ tục sp_ThemSinhVien cần INSERT vào 2 bảng:
        # 1. NGUOI_DUNG (Họ tên, Email, Role='STUDENT')
        # 2. SINH_VIEN (MSSV, NienKhoa, ChuongTrinh, KhoaID)
        sql_query = "" 

        if sql_query:
            cursor.execute(sql_query, (
                item.id, 
                item.name, 
                item.email, 
                item.facultyId, 
                item.program,
                item.cohort
            ))
            conn.commit()
            return {"message": "Thêm sinh viên thành công"}
        
        return {"message": "API đã nhận dữ liệu (Chưa có SQL)"}

    except Exception as e:
        conn.rollback()
        # Bắt lỗi từ Trigger (Ví dụ: Email không đúng định dạng)
        error_msg = str(e).split(']')[1] if ']' in str(e) else str(e)
        raise HTTPException(status_code=400, detail=error_msg)
    finally:
        conn.close()

# 3. API Xóa Sinh viên
@router.delete("/students/{student_id}")
def delete_student(student_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # --- [TODO] --- VIẾT SQL GỌI THỦ TỤC XÓA
        # Cần kiểm tra khóa ngoại (Đã có điểm chưa?) trước khi xóa
        sql_query = "" 
        
        if sql_query:
            cursor.execute(sql_query, (student_id,))
            conn.commit()
            return {"message": "Xóa thành công"}
            
        return {"message": "Chưa thực thi SQL"}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()