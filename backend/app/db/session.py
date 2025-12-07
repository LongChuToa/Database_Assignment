# src/backend/app/db/session.py
import mysql.connector
import os

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_SERVER", "localhost"),
            port=os.getenv("DB_PORT", 3306),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", "MatKhauManh123!"),
            database=os.getenv("DB_NAME", "lmsdb"),
            # Quan trọng: Hỗ trợ tiếng Việt
            charset='utf8mb4',
            use_unicode=True
        )
        return conn
    except Exception as e:
        print(f"❌ Lỗi kết nối MySQL: {e}")
        return None