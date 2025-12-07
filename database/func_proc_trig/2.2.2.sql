USE BTL_HCSDl; -- Thay thế bằng tên Database của bạn
GO

-- Xóa trigger cũ nếu tồn tại
IF OBJECT_ID('trg_UpdateDiemTongKet', 'TR') IS NOT NULL
    DROP TRIGGER trg_UpdateDiemTongKet;
GO

CREATE TRIGGER trg_UpdateDiemTongKet
ON [THAM GIA LÀM]
AFTER INSERT -- Dùng AFTER INSERT (SQL Server) thay cho FOR EACH ROW (MySQL)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Dùng một bảng tạm (hoặc INSERTED) để xử lý nhiều hàng (multi-row update)

    UPDATE H
    SET [Điểm tổng kết] = T.DiemTrungBinh
    FROM [HỌC] H
    INNER JOIN INSERTED I ON H.[Mã sinh viên] = I.[Mã sinh viên]
    INNER JOIN (
        -- Bảng tạm tính Điểm trung bình cho từng SV/Lớp bị ảnh hưởng
        SELECT 
            [Mã sinh viên],
            [Tên học kì],
            [Mã môn học],
            [Tên lớp],
            -- Tính AVG trên các điểm số đã có, làm tròn theo quy tắc
            ROUND(AVG([Điểm số]), 2) AS DiemTrungBinh 
        FROM [THAM GIA LÀM]
        WHERE [Mã sinh viên] IN (SELECT [Mã sinh viên] FROM INSERTED)
        GROUP BY 
            [Mã sinh viên], [Tên học kì], [Mã môn học], [Tên lớp]
    ) AS T
    ON H.[Mã sinh viên] = T.[Mã sinh viên]
    AND H.[Tên học kì] = T.[Tên học kì]
    AND H.[Mã môn học] = T.[Mã môn học]
    AND H.[Tên lớp] = T.[Tên lớp];
    
END
GO