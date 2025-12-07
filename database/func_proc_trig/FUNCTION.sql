DELIMITER $$

DROP FUNCTION IF EXISTS fn_TinhTongTinChiHoanThanh$$

CREATE FUNCTION fn_TinhTongTinChiHoanThanh(
    p_MaSV INT,
    p_DiemDau DECIMAL(4, 2)
)
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_TongTinChi INT DEFAULT 0;
    DECLARE v_DiemTongKet DECIMAL(4, 2);
    DECLARE v_SoTinChi INT;
    DECLARE done INT DEFAULT FALSE;

    -- Khai báo con trỏ lấy điểm và số tín chỉ
    -- Lưu ý: Dựa vào _create.sql, bảng 'HỌC' nối với 'MÔN HỌC' qua 'Mã môn học'
    DECLARE cursor_tin_chi CURSOR FOR
    SELECT
        h.`Điểm tổng kết`,
        mh.`Số tín chỉ`
    FROM
        `HỌC` h
    JOIN
        `MÔN HỌC` mh ON h.`Mã môn học` = mh.`Mã`
    WHERE
        h.`Mã sinh viên` = p_MaSV
        AND h.`Điểm tổng kết` IS NOT NULL;

    -- Khai báo handler để thoát vòng lặp
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Kiểm tra sinh viên có tồn tại không
    IF NOT EXISTS (SELECT 1 FROM `Sinh viên` WHERE `Mã EDUMEMBER` = p_MaSV) THEN
        RETURN 0;
    END IF;

    OPEN cursor_tin_chi;

    read_loop: LOOP
        FETCH cursor_tin_chi INTO v_DiemTongKet, v_SoTinChi;
        
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Nếu điểm tổng kết >= điểm đậu (tham số đầu vào) thì cộng dồn tín chỉ
        IF v_DiemTongKet >= p_DiemDau THEN
            SET v_TongTinChi = v_TongTinChi + v_SoTinChi;
        END IF;
    END LOOP;

    CLOSE cursor_tin_chi;

    RETURN v_TongTinChi;
END$$

DELIMITER ;