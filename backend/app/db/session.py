# src/backend/app/db/session.py
import pyodbc
import os

def get_db_connection():
    # Docker sẽ truyền các giá trị này vào.
    # Mặc định (fallback) vẫn để localhost để bạn chạy tay nếu muốn.
    server = os.getenv("DB_SERVER", "localhost")
    database = os.getenv("DB_NAME", "BTL2_DB")
    username = os.getenv("DB_USER", "sa")
    password = os.getenv("DB_PASSWORD", "MatKhauManh123!")

    # Lưu ý: Trong Docker, server='db', user='sa' -> Bắt buộc dùng SQL Auth
    connection_string = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password};TrustServerCertificate=yes'
    
    try:
        conn = pyodbc.connect(connection_string)
        return conn
    except Exception as e:
        print(f"❌ Lỗi kết nối DB: {e}")
        return None