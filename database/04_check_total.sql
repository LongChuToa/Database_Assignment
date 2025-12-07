-- GIẢNG VIÊN - KHOA
DELIMITER $$
CREATE TRIGGER trg_check_khoa_before_delete
BEFORE DELETE ON `GIẢNG VIÊN`
FOR EACH ROW
BEGIN
    DECLARE cnt INT;
    -- Đếm số giảng viên còn lại trong khoa của GV bị xóa
    SELECT COUNT(*) INTO cnt
    FROM `GIẢNG VIÊN`
    WHERE `Mã khoa` = OLD.`Mã khoa`;
    -- Nếu chỉ còn 1 GV (nghĩa là sau xóa khoa sẽ 0 GV)
    IF cnt <= 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể xóa giảng viên. Mỗi khoa phải có ít nhất 1 giảng viên.';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_check_khoa_before_update
BEFORE UPDATE ON `GIẢNG VIÊN`
FOR EACH ROW
BEGIN
    DECLARE cnt INT;
    -- Đếm số giảng viên còn lại trong khoa của GV bị xóa
    SELECT COUNT(*) INTO cnt
    FROM `GIẢNG VIÊN`
    WHERE `Mã khoa` = OLD.`Mã khoa`;
    -- Nếu chỉ còn 1 GV (nghĩa là sau xóa khoa sẽ 0 GV)
    IF cnt <= 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể thay đổi giảng viên. Mỗi khoa phải có ít nhất 1 giảng viên.';
    END IF;
END$$
DELIMITER ;

-- TÀI LIỆU - LOẠI TÀI LIỆU
DELIMITER $$
CREATE TRIGGER trg_check_tl_before_delete
BEFORE DELETE ON `TL THUỘC VỀ`
FOR EACH ROW
BEGIN
    DECLARE cnt INT;
    SELECT COUNT(*) INTO cnt
    FROM `TL THUỘC VỀ`
    WHERE `Mã tài liệu` = OLD.`Mã tài liệu`;
    IF cnt <= 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể xóa loại tài liệu của tài liệu. Mỗi tài liệu phải có ít nhất 1 loại tài liệu.';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_check_tl_before_update
BEFORE UPDATE ON `TL THUỘC VỀ`
FOR EACH ROW
BEGIN
    DECLARE cnt INT;
    SELECT COUNT(*) INTO cnt
    FROM `TL THUỘC VỀ`
    WHERE `Mã tài liệu` = OLD.`Mã tài liệu`;
    IF cnt <= 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể thay đổi loại tài liệu của tài liệu. Mỗi tài liệu phải có ít nhất 1 loại tài liệu.';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_check_tl_before_insert
BEFORE INSERT ON `Tài liệu`
FOR EACH ROW
BEGIN
    DECLARE cnt INT;
    SELECT COUNT(*) INTO cnt
    FROM `TL THUỘC VỀ`
    WHERE `Mã tài liệu` = NEW.`Mã`;
    IF cnt < 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể thêm trực tiếp loại tài liệu của tài liệu. Mỗi tài liệu phải có ít nhất 1 loại tài liệu.';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE insert_tailieu(
    IN p_ma INT,
    IN p_mathuvien  INT,
    IN p_ten VARCHAR(100) character set utf8mb4 collate utf8mb4_vietnamese_ci,
    IN p_ngayxuatban DATE,
    IN p_tenloaitailieu VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci
)
BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        ALTER TABLE `TL THUỘC VỀ`
        ADD CONSTRAINT fk_tlthuocve_tailieu
        FOREIGN KEY (`Mã tài liệu`) REFERENCES `TÀI LIỆU`(`Mã`);
    END;
-- SET FOREIGN_KEY_CHECKS = 0;
ALTER TABLE `TL THUỘC VỀ` DROP FOREIGN KEY fk_tlthuocve_tailieu;
START TRANSACTION;
INSERT INTO `TL THUỘC VỀ`
VALUES (p_ma, p_tenloaitailieu);
INSERT INTO `TÀI LIỆU`
VALUES (p_ma, p_mathuvien, p_ten, p_ngayxuatban);
COMMIT;
-- SET FOREIGN_KEY_CHECKS = 1;
ALTER TABLE `TL THUỘC VỀ`
ADD CONSTRAINT fk_tlthuocve_tailieu
    FOREIGN KEY (`Mã tài liệu`) REFERENCES `TÀI LIỆU`(`Mã`);
END$$
DELIMITER ;

-- ==============================
-- 1. Trigger trước khi xóa loại tài liệu lớp học
-- ==============================
DELIMITER $$
CREATE TRIGGER trg_check_tllh_before_delete
BEFORE DELETE ON `TLLH THUỘC VỀ`
FOR EACH ROW
BEGIN
    DECLARE cnt INT;
    SELECT COUNT(*) INTO cnt
    FROM `TLLH THUỘC VỀ`
    WHERE `Tên học kì` = OLD.`Tên học kì`
      AND `Mã môn học` = OLD.`Mã môn học`
      AND `Tên lớp` = OLD.`Tên lớp`
      AND `Mã tài liệu lớp học` = OLD.`Mã tài liệu lớp học`;
      
    IF cnt <= 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể xóa loại tài liệu. Mỗi tài liệu lớp học phải có ít nhất 1 loại tài liệu.';
    END IF;
END$$
DELIMITER ;

-- ==============================
-- 2. Trigger trước khi update loại tài liệu lớp học
-- ==============================
DELIMITER $$
CREATE TRIGGER trg_check_tllh_before_update
BEFORE UPDATE ON `TLLH THUỘC VỀ`
FOR EACH ROW
BEGIN
    DECLARE cnt INT;
    SELECT COUNT(*) INTO cnt
    FROM `TLLH THUỘC VỀ`
    WHERE `Tên học kì` = OLD.`Tên học kì`
      AND `Mã môn học` = OLD.`Mã môn học`
      AND `Tên lớp` = OLD.`Tên lớp`
      AND `Mã tài liệu lớp học` = OLD.`Mã tài liệu lớp học`;
      
    IF cnt <= 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể thay đổi loại tài liệu. Mỗi tài liệu lớp học phải có ít nhất 1 loại tài liệu.';
    END IF;
END$$
DELIMITER ;

-- ==============================
-- 3. Trigger trước khi insert tài liệu lớp học
-- ==============================
DELIMITER $$
CREATE TRIGGER trg_check_tllh_before_insert
BEFORE INSERT ON `Tài liệu lớp học`
FOR EACH ROW
BEGIN
    DECLARE cnt INT;
    SELECT COUNT(*) INTO cnt
    FROM `TLLH THUỘC VỀ`
    WHERE `Tên học kì` = NEW.`Tên học kì`
      AND `Mã môn học` = NEW.`Mã môn học`
      AND `Tên lớp` = NEW.`Tên lớp`
      AND `Mã tài liệu lớp học` = NEW.`Mã tài liệu`;
      
    IF cnt < 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể thêm trực tiếp tài liệu lớp học. Mỗi tài liệu lớp học phải có ít nhất 1 loại tài liệu.';
    END IF;
END$$
DELIMITER ;

-- ==============================
-- 4. Procedure insert tài liệu lớp học cùng loại tài liệu
-- ==============================
DELIMITER $$
CREATE PROCEDURE insert_tllh(
    IN p_tenkh VARCHAR(50),
    IN p_mamh INT,
    IN p_tenlop VARCHAR(50),
    IN p_matailieu INT,
    IN p_ten VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
    IN p_mota VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
    IN p_tenloai VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        ALTER TABLE `TLLH THUỘC VỀ`
        ADD CONSTRAINT fk_tllhthuocve_tllh
        FOREIGN KEY (`Tên học kì`, `Mã môn học`, `Tên lớp`, `Mã tài liệu lớp học`)
        REFERENCES `Tài liệu lớp học`(`Tên học kì`, `Mã môn học`, `Tên lớp`, `Mã tài liệu`);
    END;
    -- Tắt tạm khóa ngoại để insert đúng thứ tự
    -- SET FOREIGN_KEY_CHECKS = 0;
    ALTER TABLE `TLLH THUỘC VỀ` DROP FOREIGN KEY fk_tllhthuocve_tllh;
    -- Insert vào bảng quan hệ trước (TLLH THUỘC VỀ)
    START TRANSACTION;
    INSERT INTO `TLLH THUỘC VỀ`
    VALUES (p_tenkh, p_mamh, p_tenlop, p_matailieu, p_tenloai);
    
    -- Insert vào bảng tài liệu lớp học
    INSERT INTO `Tài liệu lớp học`
    VALUES (p_tenkh, p_mamh, p_tenlop, p_matailieu, p_ten, p_mota);
    COMMIT;
    -- Bật lại khóa ngoại
    -- SET FOREIGN_KEY_CHECKS = 1;
    ALTER TABLE `TLLH THUỘC VỀ`
    ADD CONSTRAINT fk_tllhthuocve_tllh
    FOREIGN KEY (`Tên học kì`, `Mã môn học`, `Tên lớp`, `Mã tài liệu lớp học`)
    REFERENCES `Tài liệu lớp học`(`Tên học kì`, `Mã môn học`, `Tên lớp`, `Mã tài liệu`);
END$$
DELIMITER ;


-- Trigger trước khi xóa hoặc update 1 bản ghi HỌC (đảm bảo lớp và sv còn tồn tại)
DELIMITER $$

-- Kiểm tra khi xóa HỌC (mỗi lớp học phải có ít nhất 1 sinh viên)
CREATE TRIGGER trg_check_hoc_before_delete
BEFORE DELETE ON `HỌC`
FOR EACH ROW
BEGIN
    DECLARE cnt INT;

    -- Đếm số sinh viên còn lại trong lớp học
    SELECT COUNT(*) INTO cnt
    FROM `HỌC`
    WHERE `Tên học kì` = OLD.`Tên học kì`
      AND `Mã môn học` = OLD.`Mã môn học`
      AND `Tên lớp` = OLD.`Tên lớp`;

    IF cnt <= 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể xóa. Mỗi lớp học phải có ít nhất 1 sinh viên.';
    END IF;
END$$

-- Kiểm tra khi xóa HỌC (mỗi sinh viên phải còn ít nhất 1 lớp)
CREATE TRIGGER trg_check_hoc_before_delete_sv
BEFORE DELETE ON `HỌC`
FOR EACH ROW
BEGIN
    DECLARE cnt_sv INT;

    -- Đếm số lớp học còn lại mà sinh viên tham gia
    SELECT COUNT(*) INTO cnt_sv
    FROM `HỌC`
    WHERE `Mã sinh viên` = OLD.`Mã sinh viên`;

    IF cnt_sv <= 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể xóa. Mỗi sinh viên phải học ít nhất 1 lớp.';
    END IF;
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER trg_check_hoc_before_update
BEFORE UPDATE ON `HỌC`
FOR EACH ROW
BEGIN
    DECLARE cnt_class INT;
    DECLARE cnt_student INT;

    -- Kiểm tra số lớp của sinh viên cũ
    SELECT COUNT(*) INTO cnt_class
    FROM `HỌC`
    WHERE `Mã sinh viên` = OLD.`Mã sinh viên`;

    IF cnt_class <= 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể cập nhật. Mỗi sinh viên phải học ít nhất 1 lớp.';
    END IF;

    -- Kiểm tra số sinh viên của lớp cũ
    SELECT COUNT(*) INTO cnt_student
    FROM `HỌC`
    WHERE `Tên học kì` = OLD.`Tên học kì`
      AND `Mã môn học` = OLD.`Mã môn học`
      AND `Tên lớp` = OLD.`Tên lớp`;

    IF cnt_student <= 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể cập nhật. Mỗi lớp học phải có ít nhất 1 sinh viên.';
    END IF;
END$$

DELIMITER ;


DELIMITER $$
CREATE TRIGGER trg_check_sv_before_insert
BEFORE INSERT ON `Sinh viên`
FOR EACH ROW
BEGIN
    DECLARE cnt INT;

    -- Kiểm tra xem sinh viên mới có tham gia ít nhất 1 lớp học không
    SELECT COUNT(*) INTO cnt
    FROM `HỌC`
    WHERE `Mã sinh viên` = NEW.`Mã EDUMEMBER`;

    IF cnt < 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể thêm sinh viên chưa đăng ký học lớp nào.';
    END IF;
END$$
DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_check_lophoc_before_insert
BEFORE INSERT ON `LỚP HỌC`
FOR EACH ROW
BEGIN
    DECLARE cnt INT;

    -- Kiểm tra xem lớp học mới có ít nhất 1 sinh viên đã đăng ký không
    SELECT COUNT(*) INTO cnt
    FROM `HỌC`
    WHERE `Tên học kì` = NEW.`Tên học kì`
      AND `Mã môn học` = NEW.`Mã môn học`
      AND `Tên lớp` = NEW.`Tên lớp`;

    IF cnt < 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể thêm lớp học chưa có sinh viên nào.';
    END IF;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE insert_sinhvien_hoc(
    IN p_maSV INT,
    IN p_lop VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
    IN p_ct VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
    IN p_nienkhoa YEAR,
    IN p_makhoa VARCHAR(10),
    IN p_tenkh VARCHAR(50),
    IN p_mamh INT,
    IN p_tenlop VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        ALTER TABLE `HỌC`
        ADD CONSTRAINT fk_hoc_sinhvien
        FOREIGN KEY (`Mã sinh viên`) REFERENCES `SINH VIÊN`(`Mã EDUMEMBER`);
    END;
    -- Tạm tắt kiểm tra khóa ngoại
    -- SET FOREIGN_KEY_CHECKS = 0;
    ALTER TABLE `HỌC` DROP FOREIGN KEY fk_hoc_sinhvien;
    START TRANSACTION;
    -- Insert vào bảng HỌC để đảm bảo sinh viên đã đăng ký lớp
    INSERT INTO `HỌC`(`Mã sinh viên`, `Tên học kì`, `Mã môn học`, `Tên lớp`, `Điểm tổng kết`, `Ngày đăng kí`, `Trạng thái học`)
    VALUES (p_maSV, p_tenkh, p_mamh, p_tenlop, NULL, CURDATE(), 'Đang học');
    -- Insert Sinh viên
    INSERT INTO `Sinh viên`(`Mã EDUMEMBER`, `Lớp`, `Chương trình`, `Niên khóa`, `Mã khoa`)
    VALUES (p_maSV, p_lop, p_ct, p_nienkhoa, p_makhoa);
    COMMIT;
    -- Bật lại kiểm tra khóa ngoại
    -- SET FOREIGN_KEY_CHECKS = 1;
    ALTER TABLE `HỌC`
    ADD CONSTRAINT fk_hoc_sinhvien
    FOREIGN KEY (`Mã sinh viên`) REFERENCES `SINH VIÊN`(`Mã EDUMEMBER`);
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE insert_lophoc_hoc(
    IN p_tenkh VARCHAR(50),
    IN p_mamh INT,
    IN p_tenlop VARCHAR(50),
    IN p_magv INT,
    IN p_maSV INT,
    IN p_thu ENUM('2','3','4','5','6','7','CN'),
    IN p_giohoc TIME,
    IN p_diadiem VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        ALTER TABLE `HỌC`
        ADD CONSTRAINT fk_hoc_lophoc
        FOREIGN KEY (`Tên học kì`, `Mã môn học`, `Tên lớp`)
        REFERENCES `LỚP HỌC`(`Tên học kì`, `Mã môn học`, `Tên lớp`);
    END;
    -- Tạm tắt kiểm tra khóa ngoại
    -- SET FOREIGN_KEY_CHECKS = 0;
    ALTER TABLE `HỌC` DROP FOREIGN KEY fk_hoc_lophoc;
    START TRANSACTION;
    -- Insert vào bảng HỌC để đảm bảo lớp có ít nhất 1 sinh viên
    INSERT INTO `HỌC`(`Mã sinh viên`, `Tên học kì`, `Mã môn học`, `Tên lớp`, `Điểm tổng kết`, `Ngày đăng kí`, `Trạng thái học`)
    VALUES (p_maSV, p_tenkh, p_mamh, p_tenlop, NULL, CURDATE(), 'Đang học');
    -- Insert Lớp học
    INSERT INTO `LỚP HỌC`(`Tên học kì`, `Mã môn học`, `Tên lớp`, `Mã giảng viên`, `Thứ`, `Giờ học`, `Địa điểm`)
    VALUES (p_tenkh, p_mamh, p_tenlop, p_magv, p_thu, p_giohoc, p_diadiem);
    COMMIT;
        -- Bật lại kiểm tra khóa ngoại
    -- SET FOREIGN_KEY_CHECKS = 1;
    ALTER TABLE `HỌC`
    ADD CONSTRAINT fk_hoc_lophoc
    FOREIGN KEY (`Tên học kì`, `Mã môn học`, `Tên lớp`)
    REFERENCES `LỚP HỌC`(`Tên học kì`, `Mã môn học`, `Tên lớp`);
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_check_thuvien_before_delete
BEFORE DELETE ON `Quản lý`
FOR EACH ROW
BEGIN
    DECLARE cnt INT;

    -- Đếm số ADMIN còn lại trong thư viện của ADMIN bị xóa
    SELECT COUNT(*) INTO cnt
    FROM `Quản lý`
    WHERE `Mã thư viện` = OLD.`Mã thư viện`;

    -- Nếu chỉ còn 1 ADMIN, chặn xóa
    IF cnt <= 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể xóa ADMIN. Mỗi Thư viện phải có ít nhất 1 ADMIN.';
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_check_thuvien_before_update
BEFORE UPDATE ON `Quản lý`
FOR EACH ROW
BEGIN
    DECLARE cnt INT;

    -- Đếm số ADMIN còn lại trong thư viện của ADMIN bị thay đổi
    SELECT COUNT(*) INTO cnt
    FROM `Quản lý`
    WHERE `Mã thư viện` = OLD.`Mã thư viện`;

    -- Nếu chỉ còn 1 ADMIN, chặn update
    IF cnt <= 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể thay đổi ADMIN. Mỗi Thư viện phải có ít nhất 1 ADMIN.';
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_check_thuvien_before_insert
BEFORE INSERT ON `Thư viện`
FOR EACH ROW
BEGIN
    DECLARE cnt INT;

    -- Kiểm tra xem đã có ADMIN cho thư viện chưa
    SELECT COUNT(*) INTO cnt
    FROM `Quản lý`
    WHERE `Mã thư viện` = NEW.`Mã`;

    IF cnt < 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể thêm thư viện. Mỗi thư viện phải có ít nhất 1 ADMIN.';
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE insert_thuvien(
    IN p_mathuvien INT,       -- Mã thư viện
    IN p_namthanhlap YEAR,    -- Năm thành lập
    IN p_maadmin INT          -- Mã ADMIN quản lý
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        ALTER TABLE `Quản lý`
        ADD CONSTRAINT FK_QuanLy_ThuVien FOREIGN KEY (`Mã thư viện`)
        REFERENCES `Thư viện`(`Mã`)
        ON DELETE CASCADE
        ON UPDATE CASCADE;
    END;
    -- Tắt tạm khóa ngoại để insert đúng thứ tự
    -- SET FOREIGN_KEY_CHECKS = 0;
    ALTER TABLE `Quản lý` DROP FOREIGN KEY FK_QuanLy_ThuVien;
    START TRANSACTION;
    -- Insert ADMIN quản lý thư viện
    INSERT INTO `Quản lý` (`Mã ADMIN`, `Mã thư viện`)
    VALUES (p_maadmin, p_mathuvien);

    -- Insert thư viện
    INSERT INTO `Thư viện` (`Mã`, `Năm thành lập`)
    VALUES (p_mathuvien, p_namthanhlap);
    COMMIT;
    -- Bật lại khóa ngoại
    -- SET FOREIGN_KEY_CHECKS = 1;
    ALTER TABLE `Quản lý`
    ADD CONSTRAINT FK_QuanLy_ThuVien FOREIGN KEY (`Mã thư viện`)
    REFERENCES `Thư viện`(`Mã`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

END$$

DELIMITER ;

DELIMITER $$

-- Trigger trước khi xóa ADMIN trong bảng Giám sát
CREATE TRIGGER trg_check_edumember_before_delete
BEFORE DELETE ON `Giám sát`
FOR EACH ROW
BEGIN
    DECLARE cnt INT;

    -- Đếm số admin còn lại giám sát cho EDUMEMBER
    SELECT COUNT(*) INTO cnt
    FROM `Giám sát`
    WHERE `Mã EDUMEMBER` = OLD.`Mã EDUMEMBER`;

    -- Nếu chỉ còn 1 admin (tức xóa sẽ làm EDUMEMBER không còn admin)
    IF cnt <= 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể xóa ADMIN. Mỗi EDUMEMBER phải có ít nhất 1 ADMIN giám sát.';
    END IF;
END$$

DELIMITER ;

DELIMITER $$

-- Trigger trước khi update ADMIN trong bảng Giám sát (nếu thay đổi Mã ADMIN)
CREATE TRIGGER trg_check_edumember_before_update
BEFORE UPDATE ON `Giám sát`
FOR EACH ROW
BEGIN
    DECLARE cnt INT;

    SELECT COUNT(*) INTO cnt
    FROM `Giám sát`
    WHERE `Mã EDUMEMBER` = OLD.`Mã EDUMEMBER`;

    IF cnt <= 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể thay đổi ADMIN. Mỗi EDUMEMBER phải có ít nhất 1 ADMIN giám sát.';
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_check_edumember_before_insert
BEFORE INSERT ON `EDUMEMBER`
FOR EACH ROW
BEGIN
    DECLARE cnt INT;

    -- Đếm số admin đã giám sát EDUMEMBER đang thêm
    SELECT COUNT(*) INTO cnt
    FROM `Giám sát`
    WHERE `Mã EDUMEMBER` = NEW.`Mã người dùng`;

    -- Nếu chưa có admin giám sát
    IF cnt < 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể thêm trực tiếp EDUMEMBER. Mỗi EDUMEMBER phải có ít nhất 1 ADMIN giám sát.';
    END IF;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE insert_edumember(
    IN p_maedumember INT,
    IN p_ngaythamgia DATE,
    IN p_trangthai BOOLEAN,
    IN p_maadmin INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        ALTER TABLE `Giám sát`
        ADD CONSTRAINT FK_GiamSat_EDUMEMBER FOREIGN KEY (`Mã EDUMEMBER`)
        REFERENCES EDUMEMBER(`Mã người dùng`)
        ON DELETE CASCADE
        ON UPDATE CASCADE;
    END;
    -- Tắt khóa ngoại tạm thời để insert đúng thứ tự
    -- SET FOREIGN_KEY_CHECKS = 0;
    ALTER TABLE `Giám sát` DROP FOREIGN KEY FK_GiamSat_EDUMEMBER;
    START TRANSACTION;
    -- Thêm admin giám sát
    INSERT INTO `Giám sát` (`Mã ADMIN`, `Mã EDUMEMBER`)
    VALUES (p_maadmin, p_maedumember);

    -- Thêm EDUMEMBER
    INSERT INTO `EDUMEMBER` (`Mã người dùng`, `Ngày tham gia`, `Trạng thái hoạt động`)
    VALUES (p_maedumember, p_ngaythamgia, p_trangthai);
    COMMIT;
    -- Bật lại khóa ngoại
    -- SET FOREIGN_KEY_CHECKS = 1;
    ALTER TABLE `Giám sát`
    ADD CONSTRAINT FK_GiamSat_EDUMEMBER FOREIGN KEY (`Mã EDUMEMBER`)
    REFERENCES EDUMEMBER(`Mã người dùng`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
END$$

DELIMITER ;
