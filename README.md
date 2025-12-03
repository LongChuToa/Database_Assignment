# BTL2 - HỆ THỐNG QUẢN LÝ HỌC TẬP (BK-LMS)

_Cảm ơn sự tài trợ đến từ Gemini 3.0, Chat GPT 5.1_

Bài tập lớn số 2 môn Hệ Cơ sở Dữ liệu (CO2013).
Dự án xây dựng hệ thống quản lý lớp học, môn học, và tính toán điểm số sinh viên.

---

## 📋 Yêu cầu hệ thống (Prerequisites)

Để chạy được dự án, máy tính cần cài đặt sẵn:

1.  **Hệ quản trị CSDL:** Microsoft SQL Server (hoặc MySQL).
2.  **Backend Runtime:** [Python 3.9+](https://www.python.org/downloads/)
3.  **Frontend Runtime:** [Node.js (LTS version)](https://nodejs.org/)
4.  **Editor:** VS Code (Khuyên dùng).

---

## 🚀 Hướng dẫn Cài đặt & Chạy (Quick Start)

Vui lòng thực hiện tuần tự theo 3 bước sau:

### BƯỚC 1: Khởi tạo Database (SQL)

1.  Mở SQL Server Management Studio (SSMS).
2.  Tạo một Database mới tên là **`BTL2_DB`**.
3.  Mở và chạy lần lượt các file script trong thư mục `src/database/` theo thứ tự:
    * `01_schema_creation.sql`: Tạo bảng và khóa.
    * `02_data_seeding.sql`: Nhập dữ liệu mẫu.
    * `03_procedures_crud.sql`: Các thủ tục thêm/xóa/sửa.
    * `04_triggers.sql`: Các Trigger kiểm tra ràng buộc.
    * `06_functions.sql`: Các hàm tính toán điểm.

---

### BƯỚC 2: Chạy Backend (Python API)

Backend chịu trách nhiệm kết nối Database và cung cấp API cho Web.

1.  Mở **Terminal** tại thư mục gốc dự án.
2.  Di chuyển vào thư mục backend:
    ```bash
    cd src/backend
    ```
3.  **Quan trọng:** Mở file `src/backend/app/db/session.py` và cập nhật thông tin đăng nhập SQL Server của bạn (Server Name, User, Password).
4.  Cài đặt các thư viện cần thiết:
    ```bash
    pip install -r requirements.txt
    ```
5.  Khởi chạy Server:
    ```bash
    uvicorn app.main:app --reload
    ```
6.  Nếu thành công, bạn sẽ thấy thông báo server đang chạy tại: `http://localhost:8000`
    * *Kiểm tra API Docs:* Truy cập `http://localhost:8000/docs` để xem danh sách API.

---

### BƯỚC 3: Chạy Frontend (Web Interface)

Giao diện người dùng (ReactJS).

1.  Mở một **Terminal mới** (giữ terminal Backend đang chạy).
2.  Di chuyển vào thư mục frontend:
    ```bash
    cd src/frontend
    ```
3.  Cài đặt các gói thư viện Node (chỉ làm lần đầu):
    ```bash
    npm install
    ```
4.  Khởi chạy trang web:
    ```bash
    npm start
    ```
5.  Trình duyệt sẽ tự động mở tại địa chỉ: `http://localhost:3000`

---

## 📂 Cấu trúc Dự án

```plaintext
src/
├── database/           # Chứa các file Script SQL (.sql)
│   ├── 01_schema...    
│   ├── 03_procedures...
│   └── ...
├── backend/            # Mã nguồn Python FastAPI
│   ├── app/
│   │   ├── api/        # Các API Endpoints (CRUD, Report)
│   │   ├── db/         # Cấu hình kết nối CSDL
│   │   └── models/     # Định nghĩa dữ liệu
│   └── requirements.txt
└── frontend/           # Mã nguồn ReactJS
    ├── public/
    └── src/
        ├── pages/      # Các màn hình (List, CRUD, Report)
        └── App.js      # Điều hướng chính
