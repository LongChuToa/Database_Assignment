from fastapi import APIRouter, HTTPException
from ....db.session import get_db_connection
from ....models.student_model import StudentCreate, StudentSearch

router = APIRouter()

@router.post("/students/create")
def create_student(item: StudentCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # [TODO] Query: Gọi SP để insert lần lượt vào 3 bảng:
        # 1. NGUOI_DUNG (Ma, Email, TenDangNhap, MatKhau...)
        # 2. EDUMEMBER (MaNguoiDung...)
        # 3. SINH_VIEN (MaEduMember, Lop, ChuongTrinh...)
        sql_query = "" 
        
        if sql_query:
            # Thực thi...
            conn.commit()
            return {"message": "Thêm sinh viên thành công"}
        return {"message": "Đã nhận dữ liệu"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()