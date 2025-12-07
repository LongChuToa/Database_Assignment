DROP DATABASE IF EXISTS BTL_HCSDL;
GO

-- Tạo database mới
CREATE DATABASE BTL_HCSDL;
GO

-- Chọn database mới để làm việc
USE BTL_HCSDL;
GO

CREATE TABLE [KHOA] (
    [Mã] INT PRIMARY KEY,
    [Tên] VARCHAR(50) COLLATE Vietnamese_CI_AS UNIQUE,
    [Email] VARCHAR(50) UNIQUE,
    [Năm thành lập] DATE,
    [Số điện thoại] VARCHAR(50)
);

CREATE TABLE [TÁC GIẢ TÀI LIỆU] (
    [Mã tài liệu] INT,
    [Tên tác giả] VARCHAR(50) COLLATE Vietnamese_CI_AS,
    PRIMARY KEY([Mã tài liệu], [Tên tác giả])
);

CREATE TABLE [GIẢNG VIÊN] (
    [Mã EDUMEMBER] INT PRIMARY KEY,
    [Học vị] VARCHAR(50) COLLATE Vietnamese_CI_AS,
    [Chức danh] VARCHAR(50) COLLATE Vietnamese_CI_AS,
    [Lĩnh vực] VARCHAR(50) COLLATE Vietnamese_CI_AS,
    [Số năm kinh nghiệm] INT,
    [Mã khoa] INT NOT NULL
);

CREATE TABLE [MÔN HỌC] (
    [Mã] INT PRIMARY KEY,
    [Tên] VARCHAR(50) COLLATE Vietnamese_CI_AS,
    [Số tín chỉ] INT,
    [Mô tả] VARCHAR(50) COLLATE Vietnamese_CI_AS
);

CREATE TABLE [TL THUỘC VỀ] (
    [Mã tài liệu] INT,
    [Tên loại tài liệu] VARCHAR(50) COLLATE Vietnamese_CI_AS,
    PRIMARY KEY ([Mã tài liệu],[Tên loại tài liệu])
);

CREATE TABLE [LOẠI TÀI LIỆU] (
    [Tên] VARCHAR(50) COLLATE Vietnamese_CI_AS PRIMARY KEY,
    [Tên cha] VARCHAR(50) COLLATE Vietnamese_CI_AS
);

CREATE TABLE [HỌC KÌ] (
    [Tên học kì] VARCHAR(50) PRIMARY KEY
);

CREATE TABLE [LỚP HỌC] (
    [Tên học kì] VARCHAR(50),
    [Mã môn học] INT,
    [Tên lớp] VARCHAR(50),
    [Mã giảng viên] INT NOT NULL,
    [Thứ] CHAR(2),
    [Giờ học] TIME,
    [Địa điểm] VARCHAR(50) COLLATE Vietnamese_CI_AS,
    PRIMARY KEY ([Tên học kì], [Mã môn học], [Tên lớp]),
    CHECK ([Thứ] IN ('2','3','4','5','6','7','CN'))
);

CREATE TABLE [Tài liệu lớp học] (
    [Tên học kì] VARCHAR(50),
    [Mã môn học] INT,
    [Tên lớp] VARCHAR(50),
    [Mã tài liệu] INT,
    [Tên] VARCHAR(50) COLLATE Vietnamese_CI_AS,
    [Mô tả] VARCHAR(50) COLLATE Vietnamese_CI_AS,
    PRIMARY KEY ([Tên học kì], [Mã môn học], [Tên lớp], [Mã tài liệu])
);

CREATE TABLE [TLLH THUỘC VỀ] (
    [Tên học kì] VARCHAR(50),
    [Mã môn học] INT,
    [Tên lớp] VARCHAR(50),
    [Mã tài liệu lớp học] INT,
    [Tên loại tài liệu] VARCHAR(50) COLLATE Vietnamese_CI_AS,
    PRIMARY KEY ([Tên học kì], [Mã môn học], [Tên lớp], [Mã tài liệu lớp học], [Tên loại tài liệu])
);

CREATE TABLE [HỌC] (
    [Mã sinh viên] INT,
    [Tên học kì] VARCHAR(50),
    [Mã môn học] INT,
    [Tên lớp] VARCHAR(50),
    [Điểm tổng kết] DECIMAL(10,2),
    [Ngày đăng kí] DATE,
    [Trạng thái học] VARCHAR(50) COLLATE Vietnamese_CI_AS,
    PRIMARY KEY ([Mã sinh viên], [Tên học kì], [Mã môn học], [Tên lớp])
);

CREATE TABLE [BÀI TẬP] (
    [Tên học kì] VARCHAR(50),
    [Mã môn học] INT,
    [Tên lớp] VARCHAR(50),
    [Mã bài tập] INT,
    [Tùy chọn] VARCHAR(50) COLLATE Vietnamese_CI_AS,
    [Hình thức làm bài] VARCHAR(50) COLLATE Vietnamese_CI_AS,
    [Tên bài] VARCHAR(50) COLLATE Vietnamese_CI_AS,
    [Mô tả] VARCHAR(50) COLLATE Vietnamese_CI_AS,
    [Thời gian bắt đầu] DATE,
    [Thời gian kết thúc] DATE,
    PRIMARY KEY ([Tên học kì], [Mã môn học], [Tên lớp], [Mã bài tập])
);

CREATE TABLE [THAM GIA LÀM] (
    [Mã sinh viên] INT,
    [Tên học kì] VARCHAR(50),
    [Mã môn học] INT,
    [Tên lớp] VARCHAR(50),
    [Mã bài tập] INT,
    [Thời gian nộp bài] DATETIME,
    [Điểm số] DECIMAL(10,2),
    PRIMARY KEY ([Mã sinh viên], [Tên học kì], [Mã môn học], [Tên lớp], [Mã bài tập])
);

DROP TABLE IF EXISTS [Truy cập];
DROP TABLE IF EXISTS [Sinh viên];
DROP TABLE IF EXISTS [Giám sát];
DROP TABLE IF EXISTS [EDUMEMBER];
DROP TABLE IF EXISTS [Quản lý];
DROP TABLE IF EXISTS [ADMIN];
DROP TABLE IF EXISTS [Số điện thoại người dùng];
DROP TABLE IF EXISTS [Tin nhắn];
DROP TABLE IF EXISTS [Gửi tin nhắn];
DROP TABLE IF EXISTS [Tài liệu];
DROP TABLE IF EXISTS [Số điện thoại thư viện];
DROP TABLE IF EXISTS [Thư viện];
DROP TABLE IF EXISTS [NGƯỜI DÙNG];

CREATE TABLE [NGƯỜI DÙNG](
    [Mã] INT PRIMARY KEY,
    [Email] VARCHAR(50),
    [Tên đăng nhập] VARCHAR(50) UNIQUE,
    [Mật khẩu] VARCHAR(100),
    [Họ và tên] VARCHAR(50) COLLATE Vietnamese_CI_AS,
    [Địa chỉ] VARCHAR(100) COLLATE Vietnamese_CI_AS
);

CREATE TABLE [Thư viện](
    [Mã] INT PRIMARY KEY,
    [Năm thành lập] INT
);

CREATE TABLE [Số điện thoại thư viện](
    [Mã thư viện] INT,
    [Số điện thoại] VARCHAR(15),
    PRIMARY KEY ([Mã thư viện], [Số điện thoại])
);

CREATE TABLE [Tài liệu](
    [Mã] INT PRIMARY KEY,
    [Mã thư viện] INT,
    [Tên] VARCHAR(100) COLLATE Vietnamese_CI_AS,
    [Ngày xuất bản] DATE
);

CREATE TABLE [Gửi tin nhắn](
    [Mã người gửi] INT,
    [Mã người nhận] INT,
    PRIMARY KEY ([Mã người gửi], [Mã người nhận])
);

CREATE TABLE [Tin nhắn](
    [Mã người gửi] INT,
    [Mã người nhận] INT,
    [Nội dung] NVARCHAR(MAX),
    [Thời gian] DATETIME,
    PRIMARY KEY ([Mã người gửi], [Mã người nhận], [Thời gian])
);

CREATE TABLE [Số điện thoại người dùng](
    [Mã người dùng] INT,
    [Số điện thoại] VARCHAR(15),
    PRIMARY KEY ([Mã người dùng], [Số điện thoại])
);

CREATE TABLE [ADMIN](
    [Mã người dùng] INT PRIMARY KEY,
    [Cấp độ quyền] INT,
    [Trạng thái quyền] VARCHAR(50) COLLATE Vietnamese_CI_AS,
    [Ngày bắt đầu quản trị] DATE
);

CREATE TABLE [Quản lý](
    [Mã ADMIN] INT,
    [Mã thư viện] INT,
    PRIMARY KEY ([Mã ADMIN], [Mã thư viện])
);

CREATE TABLE [EDUMEMBER](
    [Mã người dùng] INT PRIMARY KEY,
    [Ngày tham gia] DATE,
    [Trạng thái hoạt động] BIT DEFAULT 1
);

CREATE TABLE [Giám sát](
    [Mã ADMIN] INT,
    [Mã EDUMEMBER] INT,
    PRIMARY KEY ([Mã ADMIN], [Mã EDUMEMBER])
);

CREATE TABLE [Sinh viên](
    [Mã EDUMEMBER] INT PRIMARY KEY,
    [Lớp] VARCHAR(20) COLLATE Vietnamese_CI_AS,
    [Chương trình] VARCHAR(50) COLLATE Vietnamese_CI_AS,
    [Niên khóa] INT,
    [Mã khoa] VARCHAR(10)
);

CREATE TABLE [Truy cập](
    [Mã EDUMEMBER] INT,
    [Mã tài liệu] INT,
    [Thời gian] DATETIME,
    PRIMARY KEY ([Mã EDUMEMBER], [Mã tài liệu], [Thời gian])
);
