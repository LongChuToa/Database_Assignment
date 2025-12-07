USE BTL_HCSDL;
GO

-- Xóa trigger cũ nếu tồn tại
IF OBJECT_ID('trg_Hoc_SoLopToiDa', 'TR') IS NOT NULL
    DROP TRIGGER trg_Hoc_SoLopToiDa;
GO

CREATE TRIGGER trg_Hoc_SoLopToiDa
ON [HỌC]
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra số lớp đã đăng ký của sinh viên trong học kỳ
    IF EXISTS (
        SELECT 1
        FROM (
            SELECT i.[Mã sinh viên], i.[Tên học kì], COUNT(*) AS SoLop
            FROM [HỌC] h
            INNER JOIN inserted i
                ON h.[Mã sinh viên] = i.[Mã sinh viên]
                AND h.[Tên học kì] = i.[Tên học kì]
            GROUP BY i.[Mã sinh viên], i.[Tên học kì]
            HAVING COUNT(*) > 8
        ) AS T
    )
    BEGIN
        -- Ném lỗi nếu sinh viên đăng ký quá 8 lớp
        THROW 50001, N'Lỗi: Sinh viên không được đăng ký quá 8 lớp trong cùng một học kỳ.', 1;
        ROLLBACK TRANSACTION;
        RETURN;
    END
END
GO
