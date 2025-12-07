DELIMITER $$

-- ========================================================
-- YÊU CẦU 2.1: THỦ TỤC SỬA (UPDATE) & XÓA (DELETE)
-- (Bổ sung cho bảng SINH VIÊN để đủ bộ CRUD)
-- ========================================================

-- 1. Thủ tục Cập nhật Sinh viên
DROP PROCEDURE IF EXISTS sp_UpdateSinhVien$$
CREATE PROCEDURE sp_UpdateSinhVien(
    IN p_MaSV INT,
    IN p_HoTen VARCHAR(50),
    IN p_Email VARCHAR(50),
    IN p_Lop VARCHAR(20),
    IN p_ChuongTrinh VARCHAR(50)
)
BEGIN
    -- Kiểm tra SV có tồn tại không
    IF NOT EXISTS (SELECT 1 FROM `SINH VIÊN` WHERE `Mã EDUMEMBER` = p_MaSV) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Sinh viên không tồn tại!';
    END IF;

    START TRANSACTION;
        -- Update bảng cha
        UPDATE `NGƯỜI DÙNG` 
        SET `Họ và tên` = p_HoTen, `Email` = p_Email
        WHERE `Mã` = p_MaSV;

        -- Update bảng con
        UPDATE `SINH VIÊN`
        SET `Lớp` = p_Lop, `Chương trình` = p_ChuongTrinh
        WHERE `Mã EDUMEMBER` = p_MaSV;
    COMMIT;
END$$

-- 2. Thủ tục Xóa Sinh viên (Có kiểm tra ràng buộc nghiệp vụ)
DROP PROCEDURE IF EXISTS sp_DeleteSinhVien$$
CREATE PROCEDURE sp_DeleteSinhVien(IN p_MaSV INT)
BEGIN
    DECLARE v_CountDiem INT;

    -- Nghiệp vụ: Không được xóa SV nếu đã có điểm thi
    SELECT COUNT(*) INTO v_CountDiem 
    FROM `THAM GIA LÀM` 
    WHERE `Mã sinh viên` = p_MaSV;

    IF v_CountDiem > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Không thể xóa sinh viên này vì đã có dữ liệu làm bài tập!';
    END IF;

    -- Nếu thỏa mãn thì xóa (Cascade sẽ tự xóa bảng con)
    DELETE FROM `NGƯỜI DÙNG` WHERE `Mã` = p_MaSV;
END$$

-- ========================================================
-- YÊU CẦU 2.2.2: TRIGGER TÍNH THUỘC TÍNH DẪN XUẤT
-- (Tự động tính Điểm Tổng Kết trong bảng HỌC khi SV có điểm bài tập)
-- ========================================================

DROP TRIGGER IF EXISTS trg_UpdateDiemTongKet$$
CREATE TRIGGER trg_UpdateDiemTongKet
AFTER INSERT ON `THAM GIA LÀM`
FOR EACH ROW
BEGIN
    DECLARE v_DiemTrungBinh DECIMAL(10, 2);

    -- Tính điểm trung bình các bài tập của SV trong lớp đó
    SELECT AVG(`Điểm số`) INTO v_DiemTrungBinh
    FROM `THAM GIA LÀM`
    WHERE `Mã sinh viên` = NEW.`Mã sinh viên`
      AND `Tên học kì` = NEW.`Tên học kì`
      AND `Mã môn học` = NEW.`Mã môn học`
      AND `Tên lớp` = NEW.`Tên lớp`;

    -- Cập nhật vào thuộc tính dẫn xuất 'Điểm tổng kết' trong bảng HỌC
    UPDATE `HỌC`
    SET `Điểm tổng kết` = ROUND(v_DiemTrungBinh, 0) -- Làm tròn hoặc giữ lẻ tùy quy chế
    WHERE `Mã sinh viên` = NEW.`Mã sinh viên`
      AND `Tên học kì` = NEW.`Tên học kì`
      AND `Mã môn học` = NEW.`Mã môn học`
      AND `Tên lớp` = NEW.`Tên lớp`;
END$$

-- ========================================================
-- YÊU CẦU 2.4: HÀM THỨ 2 (FUNCTION)
-- (Hàm xếp loại học lực dựa trên điểm)
-- ========================================================

DROP FUNCTION IF EXISTS fn_XepLoaiSinhVien$$
CREATE FUNCTION fn_XepLoaiSinhVien(p_Diem DECIMAL(4,2)) 
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE v_XepLoai VARCHAR(20);

    IF p_Diem >= 9.0 THEN SET v_XepLoai = 'Xuất sắc';
    ELSEIF p_Diem >= 8.0 THEN SET v_XepLoai = 'Giỏi';
    ELSEIF p_Diem >= 7.0 THEN SET v_XepLoai = 'Khá';
    ELSEIF p_Diem >= 5.0 THEN SET v_XepLoai = 'Trung bình';
    ELSE SET v_XepLoai = 'Yếu';
    END IF;

    RETURN v_XepLoai;
END$$

DELIMITER ;