USE BTL_HCSDL;
GO

-- Xóa hàm cũ nếu tồn tại
IF OBJECT_ID('fn_KiemTraTrangThaiHocTap', 'FN') IS NOT NULL
    DROP FUNCTION fn_KiemTraTrangThaiHocTap;
GO

CREATE FUNCTION fn_KiemTraTrangThaiHocTap
(
    @MaSV INT,              -- Mã sinh viên cần kiểm tra
    @TenHocKi VARCHAR(50)   -- Học kỳ cần xét
)
RETURNS NVARCHAR(100)
AS
BEGIN
    DECLARE @DiemTongKet INT;
    DECLARE @SoMonKhongDat INT = 0;
    DECLARE @TongSoMon INT = 0;
    DECLARE @TrangThai NVARCHAR(100);

    -- 1. Kiểm tra tham số đầu vào (SV có tồn tại không?)
    IF NOT EXISTS (SELECT 1 FROM [Sinh viên] WHERE [Mã EDUMEMBER] = @MaSV)
    BEGIN
        RETURN N'Lỗi: Sinh viên không tồn tại.';
    END
    
    -- Kiểm tra Học kỳ có tồn tại không?
    IF NOT EXISTS (SELECT 1 FROM [HỌC KÌ] WHERE [Tên học kì] = @TenHocKi)
    BEGIN
        RETURN N'Lỗi: Học kỳ không hợp lệ.';
    END

    -- 2. Khai báo CON TRỎ (CURSOR)
    -- Lấy [Điểm tổng kết] cho tất cả các lớp SV đã học trong học kỳ đó
    DECLARE cursor_diem CURSOR FOR
    SELECT 
        [Điểm tổng kết]
    FROM 
        [HỌC] 
    WHERE 
        [Mã sinh viên] = @MaSV
        AND [Tên học kì] = @TenHocKi
        AND [Điểm tổng kết] IS NOT NULL; -- Lấy dữ liệu từ truy vấn để kiểm tra

    OPEN cursor_diem;
    FETCH NEXT FROM cursor_diem INTO @DiemTongKet;

    -- 3. LOOP (Vòng lặp) và IF (Tính toán dữ liệu)
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @TongSoMon = @TongSoMon + 1; -- Đếm tổng số môn đã có điểm

        IF @DiemTongKet < 50 -- Giả định điểm cần đạt để qua môn là 50
        BEGIN
            SET @SoMonKhongDat = @SoMonKhongDat + 1; -- IF: Tính số môn không đạt
        END

        FETCH NEXT FROM cursor_diem INTO @DiemTongKet;
    END

    CLOSE cursor_diem;
    DEALLOCATE cursor_diem;

    -- 4. Đánh giá trạng thái
    IF @TongSoMon = 0
        SET @TrangThai = N'Chưa có điểm trong học kỳ.';
    ELSE IF @SoMonKhongDat > 0
        -- Cảnh cáo nếu có bất kỳ môn nào dưới 50 điểm
        SET @TrangThai = N'Cảnh cáo học vụ (' + CAST(@SoMonKhongDat AS NVARCHAR(5)) + N' môn không đạt)';
    ELSE
        SET @TrangThai = N'Học tập tốt.';

    RETURN @TrangThai;
END
GO