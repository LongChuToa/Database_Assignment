# src/backend/app/db/session.py
import pyodbc
import os

def get_db_connection():
    server = os.getenv("DB_SERVER", "localhost")
    database = os.getenv("DB_NAME", "BTL_HCSDL")
    username = os.getenv("DB_USER", "sa")
    password = os.getenv("DB_PASSWORD", "MatKhauManh123!")

    connection_string = (
        f'DRIVER={{ODBC Driver 17 for SQL Server}};'
        f'SERVER={server},1433;'
        f'DATABASE={database};'
        f'UID={username};'
        f'PWD={password};'
        f'TrustServerCertificate=yes;'
    )
    
    try:
        conn = pyodbc.connect(connection_string)
        
        # --- THÊM ĐOẠN NÀY ĐỂ FIX LỖI FONT ---
        # Ép buộc Python giải mã dữ liệu từ SQL Server sang UTF-8
        conn.setdecoding(pyodbc.SQL_CHAR, encoding='utf-8')
        conn.setdecoding(pyodbc.SQL_WCHAR, encoding='utf-8')
        # -------------------------------------
        
        return conn
    except Exception as e:
        print(f"❌ Lỗi kết nối SQL Server: {e}")
        return None