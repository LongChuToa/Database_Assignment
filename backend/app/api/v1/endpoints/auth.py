# src/backend/app/api/v1/endpoints/auth.py
from fastapi import APIRouter, HTTPException
from ....db.session import get_db_connection
from ....models.auth_model import LoginRequest, RegisterRequest
from ....core.security import get_password_hash, verify_password # Import hàm bảo mật

router = APIRouter()

@router.post("/auth/login")
def login(creds: LoginRequest):
    conn = get_db_connection()
    if not conn: raise HTTPException(status_code=500, detail="Mất kết nối DB")
    cursor = conn.cursor()
    try:
        # ---------------------------------------------------------
        # SỬA ĐOẠN NÀY:
        sql_query_get_user = "" # Bạn đang để trống dòng này
        
        if not sql_query_get_user:
            # Nếu chưa điền SQL, HÃY BẮN LỖI (501: Not Implemented)
            raise HTTPException(status_code=501, detail="Backend chưa được điền câu lệnh SQL Đăng nhập!")

        cursor.execute(sql_query_get_user, (creds.username,))
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=401, detail="Tài khoản không tồn tại")
        
        # Giả sử row = (ID, Name, HashedPassword, Role)
        user_id = row[0]
        name = row[1]
        hashed_password_from_db = row[2]
        role = row[3]

        # BƯỚC 2: Kiểm tra mật khẩu bằng thư viện Python
        if not verify_password(creds.password, hashed_password_from_db):
            raise HTTPException(status_code=401, detail="Sai mật khẩu")

        # BƯỚC 3: Trả về thông tin nếu đúng
        return {
            "id": user_id,
            "name": name,
            "role": role,
            "username": creds.username,
            "avatar": "🎓" if role == 'STUDENT' else "👨‍🏫"
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@router.post("/auth/register")
def register(req: RegisterRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # BƯỚC 1: Mã hóa mật khẩu trước khi lưu
        hashed_password = get_password_hash(req.password)

        # BƯỚC 2: Gọi SP Đăng ký với mật khẩu đã mã hóa
        # Query: INSERT INTO NGUOI_DUNG (..., MatKhau, ...) VALUES (..., @HashedPass, ...)
        sql_query = "" 
        
        if sql_query:
            # Truyền hashed_password thay vì req.password
            cursor.execute(sql_query, (
                req.id, 
                req.fullName, 
                req.email, 
                req.username, 
                hashed_password 
            ))
            conn.commit()
            return {"message": "Đăng ký thành công"}
            
        return {"message": "Chưa thực thi SQL"}

    except Exception as e:
        conn.rollback()
        msg = str(e)
        if "PRIMARY KEY" in msg: msg = "ID hoặc Username đã tồn tại"
        raise HTTPException(status_code=400, detail=msg)
    finally:
        conn.close()