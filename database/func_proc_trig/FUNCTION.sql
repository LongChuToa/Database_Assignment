USE BTL_HCSDL;
GO

-- Xóa hàm cũ nếu tồn tại
IF OBJECT_ID('fn_TinhTongTinChiHoanThanh', 'FN') IS NOT NULL
    DROP FUNCTION fn_TinhTongTinChiHoanThanh;
GO

CREATE FUNCTION fn_TinhTongTinChiHoanThanh
(
    @MaSV INT,                -- Tương ứng với [Mã EDUMEMBER] trong [Sinh viên]
    @DiemDau DECIMAL(4, 2)
)
RETURNS INT
AS
BEGIN
    DECLARE @TongTinChi INT = 0;
    DECLARE @DiemTongKet DECIMAL(4, 2);
    DECLARE @SoTinChi INT;

    -- 1. Kiểm tra tham số đầu vào: SV có tồn tại không?
    IF NOT EXISTS (SELECT 1 FROM [Sinh viên] WHERE [Mã EDUMEMBER] = @MaSV)
    BEGIN
        -- Trả về 0 nếu SV không tồn tại
        RETURN 0; 
    END

    -- 2. Khai báo CURSOR
    -- Lấy [Điểm tổng kết] và [Số tín chỉ] cho tất cả các lớp SV đã học
    DECLARE cursor_tin_chi CURSOR FOR
    SELECT
        h.[Điểm tổng kết],
        mh.[Số tín chỉ]
    FROM
        [HỌC] h
    JOIN
        [LỚP HỌC] lh 
        ON h.[Tên học kì] = lh.[Tên học kì]
        AND h.[Mã môn học] = lh.[Mã môn học]
        AND h.[Tên lớp] = lh.[Tên lớp]
    JOIN
        [MÔN HỌC] mh ON lh.[Mã môn học] = mh.[Mã]
    WHERE
        h.[Mã sinh viên] = @MaSV
        AND h.[Điểm tổng kết] IS NOT NULL;  -- Chỉ xét các lớp đã có điểm

    OPEN cursor_tin_chi;
    FETCH NEXT FROM cursor_tin_chi INTO @DiemTongKet, @SoTinChi;

    -- 3. Vòng lặp qua các bản ghi bằng cursor
    WHILE @@FETCH_STATUS = 0
    BEGIN
        IF @DiemTongKet >= @DiemDau
        BEGIN
            SET @TongTinChi = @TongTinChi + @SoTinChi;
        END

        FETCH NEXT FROM cursor_tin_chi INTO @DiemTongKet, @SoTinChi;
    END

    CLOSE cursor_tin_chi;
    DEALLOCATE cursor_tin_chi;

    -- Trả về tổng số tín chỉ đã hoàn thành
    RETURN @TongTinChi;
END
GO
