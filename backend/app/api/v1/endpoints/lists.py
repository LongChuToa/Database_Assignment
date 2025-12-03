# src/backend/app/api/v1/endpoints/lists.py
from fastapi import APIRouter, HTTPException
from ....db.session import get_db_connection

router = APIRouter()

@router.get("/lists/subjects")
def get_subjects():
    """Lấy danh sách Môn học để đổ vào thẻ <select>"""
    conn = get_db_connection()
    if not conn: return []
    cursor = conn.cursor()
    try:
        # --- [TODO] --- SELECT MaMH, TenMH FROM MONHOC
        sql = "" 
        if sql:
            cursor.execute(sql)
            # Trả về list dạng [{"id": "CO2013", "name": "Hệ CSDL"}, ...]
            columns = [column[0] for column in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
        return []
    except: return []
    finally: conn.close()

@router.get("/lists/semesters")
def get_semesters():
    """Lấy danh sách Học kỳ"""
    conn = get_db_connection()
    if not conn: return []
    cursor = conn.cursor()
    try:
        # --- [TODO] --- SELECT MaHK, TenHK FROM HOCKY
        sql = "" 
        if sql:
            cursor.execute(sql)
            return [row[0] for row in cursor.fetchall()] # Trả về list string đơn giản
        return []
    except: return []
    finally: conn.close()