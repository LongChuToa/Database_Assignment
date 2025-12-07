DELIMITER $$

DROP PROCEDURE IF EXISTS sp_LayDSSVDatDiemTrongLop$$

CREATE PROCEDURE sp_LayDSSVDatDiemTrongLop(
    IN p_TenHocKi VARCHAR(50),
    IN p_MaMonHoc INT,
    IN p_TenLop VARCHAR(50),
    IN p_DiemToiThieu DECIMAL(4, 2)
)
BEGIN
    -- Kiểm tra điểm hợp lệ
    IF p_DiemToiThieu < 0 OR p_DiemToiThieu > 10 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Lỗi nhập dữ liệu: Điểm tối thiểu phải nằm trong khoảng 0 đến 10.';
    END IF;

    -- Câu truy vấn chính
    SELECT
        nd.`Mã` AS MaSV,
        nd.`Họ và tên` AS HoVaTen,
        h.`Tên lớp` AS TenLop,
        h.`Tên học kì` AS TenHocKi,
        h.`Điểm tổng kết` AS DiemTongKet
    FROM
        `NGƯỜI DÙNG` nd
    JOIN
        `Sinh viên` sv ON nd.`Mã` = sv.`Mã EDUMEMBER`
    JOIN
        `HỌC` h ON sv.`Mã EDUMEMBER` = h.`Mã sinh viên`
    WHERE
        h.`Tên học kì` = p_TenHocKi
        AND h.`Mã môn học` = p_MaMonHoc
        AND h.`Tên lớp` = p_TenLop
        AND h.`Điểm tổng kết` IS NOT NULL
        AND h.`Điểm tổng kết` >= p_DiemToiThieu
    ORDER BY
        nd.`Họ và tên` ASC;
END$$

DELIMITER ;