-- Tác giả tài liệu → TÀI LIỆU
ALTER TABLE `TÁC GIẢ TÀI LIỆU`
ADD CONSTRAINT fk_tacgia_tailieu
FOREIGN KEY (`Mã tài liệu`) REFERENCES `Tài liệu`(`Mã`);

-- GIẢNG VIÊN
ALTER TABLE `GIẢNG VIÊN`
ADD CONSTRAINT fk_giangvien_khoa
FOREIGN KEY (`Mã khoa`) REFERENCES `KHOA`(`Mã`);

ALTER TABLE `GIẢNG VIÊN`
ADD CONSTRAINT fk_giangvien_edumember
FOREIGN KEY (`Mã EDUMEMBER`) REFERENCES `EDUMEMBER`(`Mã người dùng`);

ALTER TABLE `TL THUỘC VỀ`
ADD CONSTRAINT fk_tlthuocve_tailieu
    FOREIGN KEY (`Mã tài liệu`) REFERENCES `Tài liệu`(`Mã`),
ADD CONSTRAINT fk_tlthuocve_loai
    FOREIGN KEY (`Tên loại tài liệu`) REFERENCES `LOẠI TÀI LIỆU`(`Tên`);

ALTER TABLE `LOẠI TÀI LIỆU`
ADD CONSTRAINT fk_loaitl_tencha
FOREIGN KEY (`Tên cha`) REFERENCES `LOẠI TÀI LIỆU`(`Tên`);

ALTER TABLE `LỚP HỌC`
ADD CONSTRAINT fk_lophoc_hocki
    FOREIGN KEY (`Tên học kì`) REFERENCES `HỌC KÌ`(`Tên học kì`),
ADD CONSTRAINT fk_lophoc_monhoc
    FOREIGN KEY (`Mã môn học`) REFERENCES `MÔN HỌC`(`Mã`),
ADD CONSTRAINT fk_lophoc_giangvien
    FOREIGN KEY (`Mã giảng viên`) REFERENCES `GIẢNG VIÊN`(`Mã EDUMEMBER`);

ALTER TABLE `TLLH THUỘC VỀ`
ADD CONSTRAINT fk_tllhthuocve_tllh
FOREIGN KEY (`Tên học kì`, `Mã môn học`, `Tên lớp`, `Mã tài liệu lớp học`)
REFERENCES `Tài liệu lớp học`(`Tên học kì`, `Mã môn học`, `Tên lớp`, `Mã tài liệu`),

ADD CONSTRAINT fk_tllhthuocve_loai
FOREIGN KEY (`Tên loại tài liệu`) REFERENCES `LOẠI TÀI LIỆU`(`Tên`);

ALTER TABLE `Tài liệu lớp học`
ADD CONSTRAINT fk_tllh_lophoc
FOREIGN KEY (`Tên học kì`, `Mã môn học`, `Tên lớp`)
REFERENCES `LỚP HỌC`(`Tên học kì`, `Mã môn học`, `Tên lớp`);

ALTER TABLE `HỌC`
ADD CONSTRAINT fk_hoc_sinhvien
    FOREIGN KEY (`Mã sinh viên`) REFERENCES `Sinh viên`(`Mã EDUMEMBER`),
ADD CONSTRAINT fk_hoc_lophoc
    FOREIGN KEY (`Tên học kì`, `Mã môn học`, `Tên lớp`)
    REFERENCES `LỚP HỌC`(`Tên học kì`, `Mã môn học`, `Tên lớp`);

ALTER TABLE `BÀI TẬP`
ADD CONSTRAINT fk_baitap_lophoc
FOREIGN KEY (`Tên học kì`, `Mã môn học`, `Tên lớp`)
REFERENCES `LỚP HỌC`(`Tên học kì`, `Mã môn học`, `Tên lớp`);

ALTER TABLE `THAM GIA LÀM`
ADD CONSTRAINT fk_tgl_sinhvien
    FOREIGN KEY (`Mã sinh viên`) REFERENCES `Sinh viên`(`Mã EDUMEMBER`),

ADD CONSTRAINT fk_tgl_baitap
    FOREIGN KEY (`Tên học kì`, `Mã môn học`, `Tên lớp`, `Mã bài tập`)
    REFERENCES `BÀI TẬP`(`Tên học kì`, `Mã môn học`, `Tên lớp`, `Mã bài tập`);

-- Thêm FOREIGN KEY cho Số điện thoại thư viện
ALTER TABLE `Số điện thoại thư viện`
ADD CONSTRAINT FK_SDT_ThuVien FOREIGN KEY (`Mã thư viện`)
REFERENCES `Thư viện`(`Mã`)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Thêm FOREIGN KEY cho Tài liệu
ALTER TABLE `Tài liệu`
ADD CONSTRAINT FK_TaiLieu_ThuVien FOREIGN KEY (`Mã thư viện`)
REFERENCES `Thư viện`(`Mã`)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Thêm FOREIGN KEY cho Gửi tin nhắn
ALTER TABLE `Gửi tin nhắn`
ADD CONSTRAINT FK_GuiTinNhan_NguoiGui FOREIGN KEY (`Mã người gửi`)
REFERENCES `NGƯỜI DÙNG`(`Mã`)
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE `Gửi tin nhắn`
ADD CONSTRAINT FK_GuiTinNhan_NguoiNhan FOREIGN KEY (`Mã người nhận`)
REFERENCES `NGƯỜI DÙNG`(`Mã`)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Thêm FOREIGN KEY cho Tin nhắn
ALTER TABLE `Tin nhắn`
ADD CONSTRAINT FK_TinNhan_NguoiGui FOREIGN KEY (`Mã người gửi`, `Mã người nhận`)
REFERENCES `Gửi tin nhắn`(`Mã người gửi`, `Mã người nhận`)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Thêm FOREIGN KEY cho Số điện thoại người dùng
ALTER TABLE `Số điện thoại người dùng`
ADD CONSTRAINT FK_SDT_NguoiDung FOREIGN KEY (`Mã người dùng`)
REFERENCES `NGƯỜI DÙNG`(`Mã`)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Thêm FOREIGN KEY cho ADMIN
ALTER TABLE ADMIN
ADD CONSTRAINT FK_ADMIN_NguoiDung FOREIGN KEY (`Mã người dùng`)
REFERENCES `NGƯỜI DÙNG`(`Mã`)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Thêm FOREIGN KEY cho Quản lý
ALTER TABLE `Quản lý`
ADD CONSTRAINT FK_QuanLy_ADMIN FOREIGN KEY (`Mã ADMIN`)
REFERENCES ADMIN(`Mã người dùng`)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE `Quản lý`
ADD CONSTRAINT FK_QuanLy_ThuVien FOREIGN KEY (`Mã thư viện`)
REFERENCES `Thư viện`(`Mã`)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Thêm FOREIGN KEY cho EDUMEMBER
ALTER TABLE EDUMEMBER
ADD CONSTRAINT FK_EDUMEMBER_NguoiDung FOREIGN KEY (`Mã người dùng`)
REFERENCES `NGƯỜI DÙNG`(`Mã`)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Thêm FOREIGN KEY cho Giám sát
ALTER TABLE `Giám sát`
ADD CONSTRAINT FK_GiamSat_ADMIN FOREIGN KEY (`Mã ADMIN`)
REFERENCES ADMIN(`Mã người dùng`)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE `Giám sát`
ADD CONSTRAINT FK_GiamSat_EDUMEMBER FOREIGN KEY (`Mã EDUMEMBER`)
REFERENCES EDUMEMBER(`Mã người dùng`)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Thêm FOREIGN KEY cho Sinh viên
ALTER TABLE `Sinh viên`
ADD CONSTRAINT FK_SinhVien_EDUMEMBER FOREIGN KEY (`Mã EDUMEMBER`)
REFERENCES EDUMEMBER(`Mã người dùng`)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Thêm FOREIGN KEY cho Truy cập
ALTER TABLE `Truy cập`
ADD CONSTRAINT FK_TruyCap_EDUMEMBER FOREIGN KEY (`Mã EDUMEMBER`)
REFERENCES EDUMEMBER(`Mã người dùng`)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE `Truy cập`
ADD CONSTRAINT FK_TruyCap_TaiLieu FOREIGN KEY (`Mã tài liệu`)
REFERENCES `Tài liệu`(`Mã`)
ON DELETE CASCADE
ON UPDATE CASCADE;
