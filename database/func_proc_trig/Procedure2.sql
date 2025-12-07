DELIMITER $$

DROP PROCEDURE IF EXISTS sp_ThongKeMonHocCoNhieuSV$$

CREATE PROCEDURE sp_ThongKeMonHocCoNhieuSV(
    IN p_NguongSoSV INT
)
BEGIN
    -- Kiểm tra tham số đầu vào
    IF p_NguongSoSV <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Lỗi nhập dữ liệu: Ngưỡng số lượng sinh viên phải là số nguyên dương.';
    END IF;

    -- Câu truy vấn chính
    -- Đếm số lượng sinh viên từ bảng HỌC theo từng Môn học
    SELECT
        mh.`Mã` AS MaMonHoc,
        mh.`Tên` AS TenMonHoc,
        mh.`Số tín chỉ` AS SoTinChi,
        COUNT(h.`Mã sinh viên`) AS TongSoSV
    FROM
        `MÔN HỌC` mh
    JOIN
        `HỌC` h ON mh.`Mã` = h.`Mã môn học`
    GROUP BY
        mh.`Mã`, mh.`Tên`, mh.`Số tín chỉ`
    HAVING
        COUNT(h.`Mã sinh viên`) >= p_NguongSoSV
    ORDER BY
        TongSoSV DESC;
END$$

DELIMITER ;