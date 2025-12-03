# src/backend/app/db/session.py
import pyodbc

def get_db_connection():
    # Cấu hình kết nối (Thay đổi thông tin này cho đúng máy của bạn)
    server = 'LOCALHOST'        # Tên server (VD: LOCALHOST hoặc .\SQLEXPRESS)
    database = 'BTL2_DB'        # Tên Database bạn đã tạo
    username = 'sa'             # Tài khoản đăng nhập SQL
    password = 'your_password'  # Mật khẩu SQL
    
    # Chuỗi kết nối cho SQL Server (Nếu dùng MySQL thì sửa driver lại)
    connection_string = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password}'
    
    try:
        conn = pyodbc.connect(connection_string)
        return conn
    except Exception as e:
        print(f"Lỗi kết nối Database: {e}")
        return None