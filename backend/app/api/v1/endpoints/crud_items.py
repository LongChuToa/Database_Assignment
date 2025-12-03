# src/backend/app/api/v1/endpoints/crud_items.py
from fastapi import APIRouter, HTTPException, Depends
from ....db.session import get_db_connection
from ....models.class_model import ClassCreate, ClassSearch

router = APIRouter()

# 1. API Lấy danh sách & Tìm kiếm (Câu 3.2)
@router.post("/classes/search")
def search_classes(filter: ClassSearch):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Không thể kết nối CSDL")
    
    cursor = conn.cursor()
    
    try:
        # --- [TODO] --- ĐIỀN CÂU LỆNH SQL VÀO DƯỚI ĐÂY
        # Gọi thủ tục tìm kiếm (SELECT ... WHERE ...)
        sql_query = "" 
        # Ví dụ: sql_query = "{CALL sp_TimKiemLopHoc (?, ?)}"
        
        # Thực thi
        if sql_query:
            cursor.execute(sql_query, (filter.keyword, filter.semester))
            
            # Convert kết quả từ SQL thành JSON
            columns = [column[0] for column in cursor.description]
            results = []
            for row in cursor.fetchall():
                results.append(dict(zip(columns, row)))
            return results
        else:
            return [] # Trả về rỗng nếu chưa có SQL

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# 2. API Thêm Lớp học (Câu 3.1)
@router.post("/classes/create")
def create_class(item: ClassCreate):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Lỗi kết nối DB")
    
    cursor = conn.cursor()
    
    try:
        # --- [TODO] --- ĐIỀN CÂU LỆNH SQL VÀO DƯỚI ĐÂY
        # Gọi thủ tục INSERT (Validate sẽ do SQL Trigger lo)
        sql_query = "" 
        # Ví dụ: sql_query = "{CALL sp_ThemLopHoc (?, ?, ?, ?, ?, ?)}"
        
        if sql_query:
            # Thứ tự tham số phải khớp với Stored Procedure
            cursor.execute(sql_query, (
                item.subjectId, 
                item.classCode, 
                item.semester, 
                item.lecturerId, 
                item.schedule,
                item.maxStudents
            ))
            conn.commit() # Xác nhận lưu
            return {"message": "Thêm lớp học thành công!"}
        else:
            return {"message": "Chưa có lệnh SQL, nhưng API đã nhận được dữ liệu!"}

    except Exception as e:
        conn.rollback()
        # Trả về đúng lỗi mà Trigger trong SQL ném ra
        # Ví dụ: "Giảng viên bị trùng lịch"
        error_msg = str(e).split(']')[1] if ']' in str(e) else str(e)
        raise HTTPException(status_code=400, detail=error_msg)
    finally:
        conn.close()

# 3. API Xóa Lớp học
@router.delete("/classes/{class_id}")
def delete_class(class_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # --- [TODO] --- ĐIỀN CÂU LỆNH SQL VÀO DƯỚI ĐÂY
        sql_query = "" 
        # Ví dụ: "{CALL sp_XoaLopHoc (?)}"
        
        if sql_query:
            cursor.execute(sql_query, (class_id,))
            conn.commit()
            return {"message": "Xóa thành công"}
        else:
            return {"message": "Chưa có lệnh SQL Xóa"}
            
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()