USE BTL_HCSDL;
GO

IF OBJECT_ID('sp_ThongKeMonHocCoNhieuSV', 'P') IS NOT NULL
    DROP PROCEDURE sp_ThongKeMonHocCoNhieuSV;
GO

CREATE PROCEDURE sp_ThongKeMonHocCoNhieuSV
    @NguongSoSV INT
AS
BEGIN
    -- Kiểm tra tham số đầu vào (Ngưỡng SV phải là số dương)
    IF @NguongSoSV <= 0
    BEGIN
        RAISERROR(N'Lỗi nhập dữ liệu: Ngưỡng số lượng sinh viên phải là số nguyên dương.', 16, 1)
        RETURN
    END

    -- Truy vấn chính
    SELECT
        mh.[Mã] AS [Mã Môn Học],
        mh.[Tên] AS [Tên Môn Học],
        mh.[Số tín chỉ] AS [Số Tín Chỉ],
        COUNT(h.[Mã sinh viên]) AS [Tổng Số SV]
    FROM
        [MÔN HỌC] mh
    JOIN
        [LỚP HỌC] lh ON mh.[Mã] = lh.[Mã môn học]
    JOIN
        [HỌC] h 
        ON lh.[Tên học kì] = h.[Tên học kì]
        AND lh.[Mã môn học] = h.[Mã môn học]
        AND lh.[Tên lớp] = h.[Tên lớp]
    GROUP BY
        mh.[Mã], mh.[Tên], mh.[Số tín chỉ]
    HAVING
        COUNT(h.[Mã sinh viên]) >= @NguongSoSV
    ORDER BY
        [Tổng Số SV] DESC;
END
GO
