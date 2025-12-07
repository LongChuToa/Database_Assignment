INSERT INTO `KHOA` VALUES
(1, 'Khoa Khoa học và Kỹ thuật Máy tính', 'cs@hcmut.edu.vn', '1995-01-01', '028-12345678'),
(2, 'Khoa Cơ khí', 'me@hcmut.edu.vn', '1980-03-12', '028-23456789'),
(3, 'Khoa Điện - Điện tử', 'ee@hcmut.edu.vn', '1975-07-21', '028-34567890'),
(4, 'Khoa Hóa học', 'chem@hcmut.edu.vn', '1990-11-05', '028-45678901'),
(5, 'Khoa Môi trường', 'env@hcmut.edu.vn', '2000-09-15', '028-56789012');

INSERT INTO `TÁC GIẢ TÀI LIỆU` VALUES
(101, 'Nguyễn Văn A'),
(101, 'Trần Thị B'),
(102, 'John Smith'),
(103, 'Alice Johnson'),
(104, 'Lê Quốc C'),
(105, 'Phạm Nhật D');

INSERT INTO `GIẢNG VIÊN` VALUES
(1001, 'Tiến sĩ', 'Giảng viên chính', 'Trí tuệ nhân tạo', 10, 1),
(1002, 'Thạc sĩ', 'Giảng viên', 'Khoa học máy tính', 5, 1),
(1003, 'Tiến sĩ', 'Giảng viên chính', 'Điện tử viễn thông', 12, 3),
(1004, 'Phó Giáo sư', 'Trưởng khoa', 'Cơ khí chính xác', 20, 2),
(1005, 'Tiến sĩ', 'Giảng viên', 'Môi trường nước', 7, 5);

INSERT INTO `MÔN HỌC` VALUES
(201, 'Cấu trúc dữ liệu và giải thuật', 4, 'Học về CTDL và thuật toán'),
(202, 'Lập trình hướng đối tượng', 3, 'OOP Java'),
(203, 'Trí tuệ nhân tạo', 3, 'Kiến thức nền tảng AI'),
(204, 'Điện tử cơ bản', 3, 'Mạch điện căn bản'),
(205, 'Khoa học môi trường', 2, 'Môi trường và sinh thái');

INSERT INTO `TL THUỘC VỀ` VALUES
(101, 'Giáo trình'),
(101, 'Sách tham khảo'),
(102, 'Bài báo khoa học'),
(103, 'Giáo trình'),
(104, 'Tài liệu số'),
(105, 'Hướng dẫn học tập');

INSERT INTO `LOẠI TÀI LIỆU` VALUES
('Giáo trình', NULL),
('Sách tham khảo', 'Giáo trình'),
('Bài báo khoa học', NULL),
('Tài liệu số', NULL),
('Hướng dẫn học tập', 'Tài liệu số');

INSERT INTO `HỌC KÌ` VALUES
('HK1-2023'),
('HK2-2023'),
('HK1-2024'),
('HK2-2024'),
('HK1-2025');

INSERT INTO `LỚP HỌC` VALUES
('HK1-2023', 201, 'L01', 1001, '2', '07:30:00', 'A101'),
('HK1-2023', 201, 'L02', 1002, '4', '09:30:00', 'A102'),
('HK1-2023', 202, 'L01', 1001, '3', '13:00:00', 'B201'),
('HK2-2023', 203, 'L01', 1003, '5', '08:00:00', 'C301'),
('HK1-2024', 205, 'L01', 1005, '6', '10:00:00', 'D401');

INSERT INTO `Tài liệu lớp học` VALUES
('HK1-2023', 201, 'L01', 1, 'Slide chương 1', 'Giới thiệu môn học'),
('HK1-2023', 201, 'L01', 2, 'Slide chương 2', 'Cấu trúc cây'),
('HK1-2023', 202, 'L01', 1, 'Bài giảng OOP', 'Tổng quan OOP'),
('HK2-2023', 203, 'L01', 1, 'Tài liệu AI', 'Giới thiệu AI'),
('HK1-2024', 205, 'L01', 1, 'Môi trường cơ bản', 'Khái niệm nền tảng');

INSERT INTO `TLLH THUỘC VỀ` VALUES
('HK1-2023', 201, 'L01', 1, 'Giáo trình'),
('HK1-2023', 201, 'L01', 1, 'Tài liệu số'),
('HK1-2023', 201, 'L01', 2, 'Giáo trình'),
('HK1-2023', 202, 'L01', 1, 'Hướng dẫn học tập'),
('HK2-2023', 203, 'L01', 1, 'Giáo trình');

INSERT INTO `HỌC` VALUES
(3001, 'HK1-2023', 201, 'L01', 85, '2023-01-10', 'Đang học'),
(3002, 'HK1-2023', 201, 'L01', 90, '2023-01-11', 'Hoàn thành'),
(3001, 'HK1-2023', 202, 'L01', 88, '2023-01-12', 'Đang học'),
(3003, 'HK2-2023', 203, 'L01', 92, '2023-08-01', 'Hoàn thành'),
(3004, 'HK1-2024', 205, 'L01', 80, '2024-01-15', 'Đang học');

INSERT INTO `BÀI TẬP` VALUES
('HK1-2023', 201, 'L01', 1, 'Bắt buộc', 'Làm tại nhà', 'BT1 - Mảng', 'Mảng và thao tác', '2023-01-15', '2023-01-25'),
('HK1-2023', 201, 'L01', 2, 'Tùy chọn', 'Trắc nghiệm', 'BT2 - Danh sách', 'Linked List', '2023-01-20', '2023-01-30'),
('HK1-2023', 202, 'L01', 1, 'Bắt buộc', 'Bài tự luận', 'BT1 - Class', 'Lập trình lớp', '2023-01-18', '2023-01-28'),
('HK2-2023', 203, 'L01', 1, 'Bắt buộc', 'Online', 'BT1 - AI cơ bản', 'Giới thiệu AI', '2023-08-10', '2023-08-20'),
('HK1-2024', 205, 'L01', 1, 'Tùy chọn', 'Làm tại lớp', 'BT1 - Sinh thái', 'Khái niệm sinh thái', '2024-01-20', '2024-01-25');

INSERT INTO `THAM GIA LÀM` VALUES
(3001, 'HK1-2023', 201, 'L01', 1, '2023-01-22 20:00:00', 9.0),
(3002, 'HK1-2023', 201, 'L01', 1, '2023-01-23 21:00:00', 8.5),
(3001, 'HK1-2023', 201, 'L01', 2, '2023-01-28 19:30:00', 9.5),
(3003, 'HK2-2023', 203, 'L01', 1, '2023-08-18 17:00:00', 9.0),
(3004, 'HK1-2024', 205, 'L01', 1, '2024-01-23 18:00:00', 8.0);


-- ==============================
-- 1. NGƯỜI DÙNG
-- ==============================
INSERT INTO `NGƯỜI DÙNG` VALUES
-- === Giảng viên ===
(1001, 'gv1@gmail.com', 'gv1', '$2b$12$kbGYbltmh6lAor4iVfIvaeeT0tV0L8Zg.q52ILbkuO7FWXFf.9sp.',  'Nguyễn Hải Long',     'Hà Nội'),
(1002, 'gv2@gmail.com', 'gv2', '$2b$12$Z/I/0JE6RomlQRW3Z64rJumUfi1v34NsjfQGad7q.EnjCelk.c4mK', 'Trần Thu Hằng',       'Đà Nẵng'),
(1003, 'gv3@gmail.com', 'gv3', '$2b$12$RIU8la355yxYA1Jw9KMtYeSLW9ULMOdblQpyCtF2/ltp3gZe1Ug5m', 'Lê Nhật Quang',       'TP.HCM'),
(1004, 'gv4@gmail.com', 'gv4', '$2b$12$BIJ5iSTIyzkcVpIi2eHSnOEpIEluzwo4fXj7wQU/gcA.FgB7Q1Ht.', 'Phạm Thảo Vy',        'Huế'),
(1005, 'gv5@gmail.com', 'gv5', '$2b$12$6dK1Oz9EFVSIfaCXp8nNGOVkg.cI8D3CZxnlXCo1Z8X66j7ErWmr6', 'Võ Minh Khánh',       'Cần Thơ'),
(3001, 'sv1@gmail.com', 'sv1', '$2b$12$aUSB2Xixqj0LLz33F4cUAu3Y2IWLx01RTd7jym2FTcOYfO9wztFXS', 'Nguyễn Ngọc Trâm',    'Hà Nội'),
(3002, 'sv2@gmail.com', 'sv2', '$2b$12$uwZHiRXf5N3kLPjuFTwXKuhYwsvL.WoVi44441bBOE1ptQpoNtxYa', 'Đặng Hữu Phát',       'Đà Nẵng'),
(3003, 'sv3@gmail.com', 'sv3', '$2b$12$.8Dg7kaZbMMFjQ5SLEsPmes.UqeCwBNNthgfYEwfFG6wnf1KqIlXS', 'Trần Ngọc Bảo',       'TP.HCM'),
(3004, 'sv4@gmail.com', 'sv4', '$2b$12$Qdx5jiZcgfCooXUYOw2IvOgq9nPazdDx1XqHC5fjRN2dUynkIRLrW', 'Mai Anh Thư',         'Huế'),
(3005, 'sv5@gmail.com', 'sv5', '$2b$12$axsj0ySbaRg8zgK.A5DNz.BAYl6/KkhCumsXnJQBHx13bMFlR/ihW', 'Hoàng Tấn Lộc',       'Cần Thơ'),
(2001, 'admin1@system.com', 'admin1', '$2b$12$U4b4/QyH8nUjz6R0Qa5JMei0lT0myPIc7Vv5gE/.8r1SK6ME0sl5W', 'Đặng Hoài Nam', 'Hà Nội'),
(2002, 'admin2@system.com', 'admin2', '$2b$12$eX8RlgWJfzIwEc3gJK2kDuE7CrH5kPxnH6yU3N5KjPyZlf5s1Qpfe', 'Vũ Thu Hằng', 'Đà Nẵng'),
(2003, 'admin3@system.com', 'admin3', '$2b$12$wXyq7WySxrQ/NPd6RMa1KuPJwr8v.UQ8bGV5dq0JzX9dN4WB8Q3eO', 'Ngô Bảo Khánh', 'TP.HCM'),
(2004, 'admin4@system.com', 'admin4', '$2b$12$sx9IyTtJR3aR5z4BrGk2rOsYyS5iR1bZgkqtuNqL8Nf2sKxKAJF9G', 'Phan Tường Vy', 'Hải Phòng'),
(2005, 'admin5@system.com', 'admin5', '$2b$12$H8eGhm1hYwVbU7y7kJtRKuWQm2Jt39TJSxOj1XgM7mLWbrVQZdRgK', 'Bùi Minh Hải', 'Cần Thơ');

-- ==============================
-- 2. THƯ VIỆN
-- ==============================
INSERT INTO `Thư viện` VALUES
(10, 1999),
(11, 2002),
(12, 2005),
(13, 2010),
(14, 2020);

-- ==============================
-- 3. SỐ ĐIỆN THOẠI THƯ VIỆN
-- ==============================
INSERT INTO `Số điện thoại thư viện` VALUES
(10, '0241000001'),
(11, '0241000002'),
(12, '0241000003'),
(13, '0241000004'),
(14, '0241000005');

-- ==============================
-- 4. TÀI LIỆU
-- ==============================
INSERT INTO `Tài liệu` VALUES
(101, 10, 'Thuật toán A', '2018-01-10'),
(102, 11, 'Mạng máy tính B', '2019-02-15'),
(103, 12, 'Cơ sở dữ liệu C', '2020-03-20'),
(104, 13, 'Lập trình D', '2021-04-25'),
(105, 14, 'An ninh mạng E', '2022-05-30');

-- ==============================
-- 5. GỬI TIN NHẮN
-- ==============================
INSERT INTO `Gửi tin nhắn` VALUES
(3001, 3002),
(3002, 3003),
(3003, 3004),
(3004, 3005),
(3005, 3001);

-- ==============================
-- 6. TIN NHẮN
-- ==============================
INSERT INTO `Tin nhắn` VALUES
(3001, 3002, 'Hello', '2024-01-10 10:00:00'),
(3002, 3003, 'Bạn sao rồi?', '2024-01-10 10:05:00'),
(3003, 3004, 'Đi học chưa?', '2024-01-10 10:10:00'),
(3004, 3005, 'Có bài tập không?', '2024-01-10 10:15:00'),
(3005, 3001, 'Đi ngủ đi', '2024-01-10 10:20:00');

-- ==============================
-- 7. SỐ ĐIỆN THOẠI NGƯỜI DÙNG
-- ==============================
INSERT INTO `Số điện thoại người dùng` VALUES
(1001, '0901000001'),
(1002, '0901000002'),
(1003, '0901000003'),
(1004, '0901000004'),
(1005, '0901000005'),

(2001, '0901000006'),
(2002, '0901000007'),
(2003, '0901000008'),
(2004, '0901000009'),
(2005, '0901000010'),

(3001, '0901000011'),
(3002, '0901000012'),
(3003, '0901000013'),
(3004, '0901000014'),
(3005, '0901000015');

-- ==============================
-- 8. ADMIN
-- ==============================
INSERT INTO ADMIN VALUES
(2001, 1, 'Hoạt động', '2020-01-01'),
(2002, 1, 'Hoạt động', '2021-02-02'),
(2003, 2, 'Tạm khóa', '2022-03-03'),
(2004, 2, 'Hoạt động', '2023-04-04'),
(2005, 3, 'Hoạt động', '2024-05-05');

-- ==============================
-- 9. QUẢN LÝ
-- ==============================
INSERT INTO `Quản lý` VALUES
(2001, 10),
(2002, 11),
(2003, 12),
(2004, 13),
(2005, 14);

-- ==============================
-- 10. EDUMEMBER
-- ==============================
INSERT INTO EDUMEMBER VALUES
-- ===Giảng viên===
(1001, '2020-01-01', TRUE),
(1002, '2021-02-02', TRUE),
(1003, '2022-03-03', FALSE),
(1004, '2023-04-04', TRUE),
(1005, '2024-05-05', TRUE),
-- ===Sinh viên===
(3001, '2020-02-01', TRUE),
(3002, '2021-03-02', TRUE),
(3003, '2022-04-03', FALSE),
(3004, '2023-05-04', TRUE),
(3005, '2024-06-05', TRUE);

-- ==============================
-- 11. GIÁM SÁT
-- ==============================
INSERT INTO `Giám sát` VALUES
(2001, 1002),
(2002, 1003),
(2003, 1004),
(2004, 3005),
(2005, 3001);

-- ==============================
-- 12. SINH VIÊN
-- ==============================
INSERT INTO `Sinh viên` VALUES
(3001, 'CLC1', 'Chất lượng cao', 2020, '1'),
(3002, 'DT1', 'Đại trà', 2021, '2'),
(3003, 'DT2', 'Đại trà', 2022, '3'),
(3004, 'CLC2', 'Chất lượng cao', 2023, '4'),
(3005, 'DT3', 'Đại trà', 2024, '5');

-- ==============================
-- 13. TRUY CẬP
-- ==============================
INSERT INTO `Truy cập` VALUES
(3001, 101, '2024-05-10 08:00:00'),
(3002, 102, '2024-05-10 08:10:00'),
(3003, 103, '2024-05-10 08:20:00'),
(3004, 104, '2024-05-10 08:30:00'),
(3005, 105, '2024-05-10 08:40:00');
