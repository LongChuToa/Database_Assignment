USE BTL_HCSDL; 
GO

IF OBJECT_ID('sp_LayDSSVDatDiemTrongLop', 'P') IS NOT NULL
    DROP PROCEDURE sp_LayDSSVDatDiemTrongLop;
GO

CREATE PROCEDURE sp_LayDSSVDatDiemTrongLop
    @TenHocKi NVARCHAR(50),
    @MaMonHoc INT,
    @TenLop NVARCHAR(50),
    @DiemToiThieu DECIMAL(4, 2)
AS
BEGIN
    -- Kiểm tra tham số đầu vào
    IF @DiemToiThieu < 0 OR @DiemToiThieu > 10
    BEGIN
        RAISERROR(N'Lỗi nhập dữ liệu: Điểm tối thiểu phải nằm trong khoảng 0 đến 10.', 16, 1)
        RETURN
    END

    -- Truy vấn chính
    SELECT
        sv.[Mã EDUMEMBER] AS [Mã Sinh Viên],
        nd.[Họ và tên] AS [Họ và Tên],
        lh.[Tên lớp] AS [Tên Lớp],
        h.[Điểm tổng kết] AS [Điểm Tổng Kết]
    FROM
        [Sinh viên] sv
    JOIN
        [NGƯỜI DÙNG] nd ON sv.[Mã EDUMEMBER] = nd.[Mã]
    JOIN
        [HỌC] h ON sv.[Mã EDUMEMBER] = h.[Mã sinh viên]
    JOIN
        [LỚP HỌC] lh 
        ON h.[Tên học kì] = lh.[Tên học kì]
        AND h.[Mã môn học] = lh.[Mã môn học]
        AND h.[Tên lớp] = lh.[Tên lớp]
    WHERE
        h.[Tên học kì] = @TenHocKi
        AND h.[Mã môn học] = @MaMonHoc
        AND h.[Tên lớp] = @TenLop
        AND h.[Điểm tổng kết] IS NOT NULL
        AND h.[Điểm tổng kết] >= @DiemToiThieu
    ORDER BY
        nd.[Họ và tên] ASC;
END
GO
