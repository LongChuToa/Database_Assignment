from fastapi import APIRouter, HTTPException
from ....db.session import get_db_connection
from ....models.user_model import UserProfileUpdate

router = APIRouter()

@router.put("/users/update")
def update_user_profile(user: UserProfileUpdate):
    conn = get_db_connection()
    if not conn: raise HTTPException(status_code=500, detail="Lỗi DB")
    cursor = conn.cursor()
    
    try:
        # Gọi SP Đa hình: sp_CapNhatThongTinCaNhan
        # Thứ tự tham số: Ma, HoTen, Email, DiaChi, Lop, ChuongTrinh, HocVi, ChucDanh
        sql_query = "{CALL sp_CapNhatThongTinCaNhan (?, ?, ?, ?, ?, ?, ?, ?)}"
        
        cursor.execute(sql_query, (
            user.id,
            user.fullName,
            user.email,
            user.address,
            user.className, # Null nếu là GV
            user.program,   # Null nếu là GV
            user.degree,    # Null nếu là SV
            user.title      # Null nếu là SV
        ))
        conn.commit()
        return {"message": "Cập nhật hồ sơ thành công"}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()