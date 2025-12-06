# BK-LMS: HỆ THỐNG QUẢN LÝ HỌC TẬP (Docker Version)

**Bài tập lớn số 2 - Môn Hệ Cơ sở Dữ liệu (CO2013)**
Dự án mô phỏng hệ thống quản lý lớp học, môn học và tính điểm của trường ĐH Bách Khoa, sử dụng kiến trúc Microservices đóng gói bằng Docker.

_(Thanks to Gemini 3, ChatGPT 5.1)_

---

## 🛠️ Yêu cầu cài đặt (Prerequisites)

Bạn chỉ cần cài đặt duy nhất:
1.  **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Bắt buộc).
2.  **SQL Server Management Studio (SSMS)** hoặc **Azure Data Studio** (Để nạp dữ liệu ban đầu).

*Không cần cài Python, Node.js hay SQL Server trên máy thật.*

---

## 🚀 Quy trình Khởi chạy (Quick Start)

Làm theo 3 bước sau để bật hệ thống:

### Bước 1: Khởi động hệ thống
Mở terminal tại thư mục gốc của dự án và chạy lệnh:

```bash
docker-compose up --build
````

*Lần đầu chạy sẽ mất vài phút để tải Docker Image (SQL Server, Python, Node). Khi thấy thông báo server chạy ở port 8000 và 3000 là thành công.*

### Bước 2: Nạp cơ sở dữ liệu (Quan trọng)

Khi Docker chạy, nó tạo ra một SQL Server trống rỗng. Bạn cần nạp cấu trúc bảng và thủ tục vào đó.

1.  Mở **SSMS** trên máy tính của bạn.
2.  Kết nối với thông tin sau:
      * **Server name:** `localhost,1433` (Lưu ý dấu phẩy)
      * **Authentication:** SQL Server Authentication
      * **Login:** `sa`
      * **Password:** `MatKhauManh123!` (Cấu hình trong docker-compose.yml)
3.  Mở và **Execute (F5)** lần lượt các file trong thư mục `src/database/` theo đúng thứ tự:
    1.  `01_schema_creation.sql` (Tạo bảng)
    2.  `02_data_seeding.sql` (Data mẫu)
    3.  `03_procedures_crud.sql` (Thủ tục Thêm/Sửa/Xóa)
    4.  `04_triggers.sql` (Ràng buộc toàn vẹn)
    5.  `06_functions.sql` (Hàm tính toán)

### Bước 3: Truy cập ứng dụng

Sau khi nạp xong dữ liệu, truy cập trình duyệt tại:

  * **Web Frontend:** [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
  * **API Documentation:** [http://localhost:8000/docs](https://www.google.com/search?q=http://localhost:8000/docs)

-----

## 📖 Hướng dẫn Sử dụng App

### 1\. Quản lý Lớp học (Câu 3.1 & 3.2)

  * Truy cập menu **"Danh sách Lớp học"**:
      * Xem danh sách các lớp đang mở.
      * Sử dụng thanh tìm kiếm để lọc theo **Tên môn** hoặc **Học kỳ**.
      * Bấm nút **Xóa** để hủy lớp (Hệ thống sẽ gọi SP kiểm tra ràng buộc trước khi xóa).
  * Truy cập menu **"Mở Lớp / Đăng Ký"**:
      * Nhập thông tin lớp học mới.
      * Hệ thống tự động kiểm tra logic (VD: Giảng viên có bị trùng lịch dạy không) thông qua Trigger/Procedure dưới Database.

### 2\. Xem Báo cáo & Tính điểm (Câu 3.3)

  * Truy cập menu **"Thống kê & Điểm"**.
  * Chọn một lớp học từ danh sách.
  * Nhấn **"Chạy Hàm Tính Điểm"**.
  * Hệ thống sẽ gọi Function trong SQL để tính toán điểm tổng kết, tỉ lệ qua môn và hiển thị bảng điểm chi tiết.

-----

## 📂 Cấu trúc Dự án

```plaintext
BTL2_Group6/
├── docker-compose.yml      # File cấu hình chạy toàn bộ hệ thống
├── src/
│   ├── database/           # Chứa script SQL (Chạy thủ công Bước 2)
│   ├── backend/            # Python FastAPI (Chạy port 8000)
│   │   ├── Dockerfile      # Cấu hình môi trường Python
│   │   ├── app/
│   │   │   ├── api/        # Code xử lý logic gọi xuống DB
│   │   │   └── db/         # Cấu hình kết nối
│   └── frontend/           # ReactJS (Chạy port 3000)
│       ├── Dockerfile      # Cấu hình môi trường Node.js
│       └── src/pages/      # Giao diện người dùng
```

-----

## ⚠️ Khắc phục sự cố (Troubleshooting)

**1. Không kết nối được Database từ SSMS?**

  * Đảm bảo Docker đang chạy (`docker ps` thấy container `btl2_sql_server`).
  * Đảm bảo bạn dùng dấu phẩy: `localhost,1433`.
  * Tắt tạm thời Firewall hoặc phần mềm diệt virus nếu bị chặn port.

**2. Web báo lỗi "Network Error" hoặc "Lỗi kết nối Server"?**

  * F5 lại trang web.
  * Kiểm tra xem container Backend có bị tắt không (Xem log trong terminal chạy docker).

**3. Thay đổi code nhưng không thấy cập nhật?**

  * Code Frontend/Backend hỗ trợ Hot-reload, chỉ cần lưu file là tự cập nhật.
  * Nếu sửa file cấu hình (`.env`, `Dockerfile`), cần chạy lại: `docker-compose up --build`.

-----

**Nhóm thực hiện:** Nhóm 6
