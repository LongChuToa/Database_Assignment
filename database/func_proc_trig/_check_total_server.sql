USE BTL_HCSDL;
GO
-- GIẢNG VIÊN - KHOA
CREATE TRIGGER trg_check_khoa_before_delete
ON [GIẢNG VIÊN]
INSTEAD OF DELETE
AS
BEGIN
    -- Kiểm tra số giảng viên còn lại trong khoa
    IF EXISTS (
        SELECT d.[Mã khoa]
        FROM DELETED d
        JOIN [GIẢNG VIÊN] g ON g.[Mã khoa] = d.[Mã khoa]
        GROUP BY d.[Mã khoa]
        HAVING COUNT(g.[Mã EDUMEMBER]) <= 1
    )
    BEGIN
        THROW 50000, N'Không thể xóa giảng viên. Mỗi khoa phải có ít nhất 1 giảng viên.', 1;
    END
    ELSE
    BEGIN
        -- Thực hiện xóa nếu hợp lệ
        DELETE g
        FROM [GIẢNG VIÊN] g
        JOIN DELETED d ON g.[Mã EDUMEMBER] = d.[Mã EDUMEMBER];
    END
END
GO

CREATE TRIGGER trg_check_khoa_before_update
ON [GIẢNG VIÊN]
INSTEAD OF UPDATE
AS
BEGIN
    -- Kiểm tra số giảng viên trong khoa cũ
    IF EXISTS (
        SELECT d.[Mã khoa]
        FROM DELETED d
        JOIN [GIẢNG VIÊN] g ON g.[Mã khoa] = d.[Mã khoa]
        GROUP BY d.[Mã khoa]
        HAVING COUNT(g.[Mã EDUMEMBER]) <= 1
    )
    BEGIN
        THROW 50001, N'Không thể thay đổi giảng viên. Mỗi khoa phải có ít nhất 1 giảng viên.', 1;
    END
    ELSE
    BEGIN
        -- Thực hiện update nếu hợp lệ
        UPDATE g
        SET 
            g.[Học vị] = i.[Học vị],
            g.[Chức danh] = i.[Chức danh],
            g.[Lĩnh vực] = i.[Lĩnh vực],
            g.[Số năm kinh nghiệm] = i.[Số năm kinh nghiệm],
            g.[Mã khoa] = i.[Mã khoa]
        FROM [GIẢNG VIÊN] g
        JOIN INSERTED i ON g.[Mã EDUMEMBER] = i.[Mã EDUMEMBER];
    END
END
GO

-- TÀI LIỆU - LOẠI TÀI LIỆU
CREATE TRIGGER trg_check_tl_before_delete
ON [TL THUỘC VỀ]
INSTEAD OF DELETE
AS
BEGIN
    IF EXISTS (
        SELECT d.[Mã tài liệu]
        FROM DELETED d
        JOIN [TL THUỘC VỀ] t ON t.[Mã tài liệu] = d.[Mã tài liệu]
        GROUP BY d.[Mã tài liệu]
        HAVING COUNT(t.[Tên loại tài liệu]) <= 1
    )
    BEGIN
        THROW 50000, N'Không thể xóa loại tài liệu của tài liệu. Mỗi tài liệu phải có ít nhất 1 loại tài liệu.', 1;
    END
    ELSE
    BEGIN
        DELETE t
        FROM [TL THUỘC VỀ] t
        JOIN DELETED d ON t.[Mã tài liệu] = d.[Mã tài liệu]
           AND t.[Tên loại tài liệu] = d.[Tên loại tài liệu];
    END
END
GO

CREATE TRIGGER trg_check_tl_before_update
ON [TL THUỘC VỀ]
INSTEAD OF UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT d.[Mã tài liệu]
        FROM DELETED d
        JOIN [TL THUỘC VỀ] t ON t.[Mã tài liệu] = d.[Mã tài liệu]
        GROUP BY d.[Mã tài liệu]
        HAVING COUNT(t.[Tên loại tài liệu]) <= 1
    )
    BEGIN
        THROW 50001, N'Không thể thay đổi loại tài liệu của tài liệu. Mỗi tài liệu phải có ít nhất 1 loại tài liệu.', 1;
    END
    ELSE
    BEGIN
        UPDATE t
        SET t.[Tên loại tài liệu] = i.[Tên loại tài liệu]
        FROM [TL THUỘC VỀ] t
        JOIN INSERTED i ON t.[Mã tài liệu] = i.[Mã tài liệu]
                        AND t.[Tên loại tài liệu] = i.[Tên loại tài liệu]; 
    END
END
GO

CREATE TRIGGER trg_check_tl_before_insert_taileu
ON [Tài liệu]
INSTEAD OF INSERT
AS
BEGIN
    IF EXISTS (
        SELECT i.[Mã]
        FROM INSERTED i
        LEFT JOIN [TL THUỘC VỀ] t ON t.[Mã tài liệu] = i.[Mã]
        WHERE t.[Mã tài liệu] IS NULL
    )
    BEGIN
        THROW 50002, N'Không thể thêm trực tiếp tài liệu mà không có loại tài liệu. Mỗi tài liệu phải có ít nhất 1 loại tài liệu.', 1;
    END
    ELSE
    BEGIN
        INSERT INTO [Tài liệu] ([Mã], [Mã thư viện], [Tên], [Ngày xuất bản])
        SELECT [Mã], [Mã thư viện], [Tên], [Ngày xuất bản]
        FROM INSERTED;
    END
END
GO

CREATE PROCEDURE insert_tailieu
    @p_ma INT,
    @p_mathuvien INT,
    @p_ten NVARCHAR(100),
    @p_ngayxuatban DATE,
    @p_tenloaitailieu NVARCHAR(50)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Chèn vào bảng TL THUỘC VỀ nếu chưa tồn tại
        IF NOT EXISTS (
            SELECT 1 
            FROM [TL THUỘC VỀ]
            WHERE [Mã tài liệu] = @p_ma AND [Tên loại tài liệu] = @p_tenloaitailieu
        )
        BEGIN
            INSERT INTO [TL THUỘC VỀ] ([Mã tài liệu], [Tên loại tài liệu])
            VALUES (@p_ma, @p_tenloaitailieu);
        END

        -- Chèn vào bảng Tài liệu
        INSERT INTO [Tài liệu] ([Mã], [Mã thư viện], [Tên], [Ngày xuất bản])
        VALUES (@p_ma, @p_mathuvien, @p_ten, @p_ngayxuatban);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- ==============================
-- 1. Trigger trước khi xóa loại tài liệu lớp học
-- ==============================
CREATE TRIGGER trg_check_tllh_before_delete
ON [TLLH THUỘC VỀ]
INSTEAD OF DELETE
AS
BEGIN
    -- Kiểm tra số loại tài liệu còn lại
    IF EXISTS (
        SELECT d.[Tên học kì], d.[Mã môn học], d.[Tên lớp], d.[Mã tài liệu lớp học]
        FROM DELETED d
        JOIN [TLLH THUỘC VỀ] t
            ON t.[Tên học kì] = d.[Tên học kì]
           AND t.[Mã môn học] = d.[Mã môn học]
           AND t.[Tên lớp] = d.[Tên lớp]
           AND t.[Mã tài liệu lớp học] = d.[Mã tài liệu lớp học]
        GROUP BY d.[Tên học kì], d.[Mã môn học], d.[Tên lớp], d.[Mã tài liệu lớp học]
        HAVING COUNT(t.[Tên loại tài liệu]) <= 1
    )
    BEGIN
        THROW 50000, N'Không thể xóa loại tài liệu. Mỗi tài liệu lớp học phải có ít nhất 1 loại tài liệu.', 1;
    END
    ELSE
    BEGIN
        -- Xóa bản ghi nếu hợp lệ
        DELETE t
        FROM [TLLH THUỘC VỀ] t
        JOIN DELETED d
            ON t.[Tên học kì] = d.[Tên học kì]
           AND t.[Mã môn học] = d.[Mã môn học]
           AND t.[Tên lớp] = d.[Tên lớp]
           AND t.[Mã tài liệu lớp học] = d.[Mã tài liệu lớp học]
           AND t.[Tên loại tài liệu] = d.[Tên loại tài liệu];
    END
END
GO

-- ==============================
-- 2. Trigger trước khi update loại tài liệu lớp học
-- ==============================
CREATE TRIGGER trg_check_tllh_before_update
ON [TLLH THUỘC VỀ]
INSTEAD OF UPDATE
AS
BEGIN
    -- Kiểm tra số loại tài liệu trong khóa cũ
    IF EXISTS (
        SELECT d.[Tên học kì], d.[Mã môn học], d.[Tên lớp], d.[Mã tài liệu lớp học]
        FROM DELETED d
        JOIN [TLLH THUỘC VỀ] t
            ON t.[Tên học kì] = d.[Tên học kì]
           AND t.[Mã môn học] = d.[Mã môn học]
           AND t.[Tên lớp] = d.[Tên lớp]
           AND t.[Mã tài liệu lớp học] = d.[Mã tài liệu lớp học]
        GROUP BY d.[Tên học kì], d.[Mã môn học], d.[Tên lớp], d.[Mã tài liệu lớp học]
        HAVING COUNT(t.[Tên loại tài liệu]) <= 1
    )
    BEGIN
        THROW 50001, N'Không thể thay đổi loại tài liệu. Mỗi tài liệu lớp học phải có ít nhất 1 loại tài liệu.', 1;
    END
    ELSE
    BEGIN
        -- Thực hiện update nếu hợp lệ
        UPDATE t
        SET t.[Tên loại tài liệu] = i.[Tên loại tài liệu]
        FROM [TLLH THUỘC VỀ] t
        JOIN INSERTED i
            ON t.[Tên học kì] = i.[Tên học kì]
           AND t.[Mã môn học] = i.[Mã môn học]
           AND t.[Tên lớp] = i.[Tên lớp]
           AND t.[Mã tài liệu lớp học] = i.[Mã tài liệu lớp học];
    END
END
GO

-- ==============================
-- 3. Trigger trước khi insert tài liệu lớp học
-- ==============================
CREATE TRIGGER trg_check_tllh_before_insert
ON [Tài liệu lớp học]
INSTEAD OF INSERT
AS
BEGIN
    -- Kiểm tra tài liệu lớp học đã có loại chưa
    IF EXISTS (
        SELECT i.[Tên học kì], i.[Mã môn học], i.[Tên lớp], i.[Mã tài liệu]
        FROM INSERTED i
        LEFT JOIN [TLLH THUỘC VỀ] t
            ON t.[Tên học kì] = i.[Tên học kì]
           AND t.[Mã môn học] = i.[Mã môn học]
           AND t.[Tên lớp] = i.[Tên lớp]
           AND t.[Mã tài liệu lớp học] = i.[Mã tài liệu]
        WHERE t.[Tên loại tài liệu] IS NULL
    )
    BEGIN
        THROW 50002, N'Không thể thêm trực tiếp tài liệu lớp học. Mỗi tài liệu lớp học phải có ít nhất 1 loại tài liệu.', 1;
    END
    ELSE
    BEGIN
        -- Insert bình thường nếu hợp lệ
        INSERT INTO [Tài liệu lớp học]
            ([Tên học kì],[Mã môn học],[Tên lớp],[Mã tài liệu],[Tên],[Mô tả])
        SELECT [Tên học kì],[Mã môn học],[Tên lớp],[Mã tài liệu],[Tên],[Mô tả]
        FROM INSERTED;
    END
END
GO

-- ==============================
-- 4. Procedure insert tài liệu lớp học cùng loại tài liệu
-- ==============================
CREATE PROCEDURE insert_tllh
    @p_tenkh VARCHAR(50),
    @p_mamh INT,
    @p_tenlop VARCHAR(50),
    @p_matailieu INT,
    @p_ten VARCHAR(50),
    @p_mota VARCHAR(50),
    @p_tenloai VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Insert vào bảng TLLH THUỘC VỀ
        INSERT INTO [TLLH THUỘC VỀ]
            ([Tên học kì], [Mã môn học], [Tên lớp], [Mã tài liệu lớp học], [Tên loại tài liệu])
        VALUES
            (@p_tenkh, @p_mamh, @p_tenlop, @p_matailieu, @p_tenloai);

        -- Insert vào bảng Tài liệu lớp học
        INSERT INTO [Tài liệu lớp học]
            ([Tên học kì], [Mã môn học], [Tên lớp], [Mã tài liệu], [Tên], [Mô tả])
        VALUES
            (@p_tenkh, @p_mamh, @p_tenlop, @p_matailieu, @p_ten, @p_mota);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- ==============================
-- 1. Trigger trước khi xóa bản ghi HỌC (đảm bảo lớp và sinh viên còn tồn tại)
-- ==============================

-- Mỗi lớp học phải có ít nhất 1 sinh viên
CREATE TRIGGER trg_check_hoc_before_delete_class
ON [HỌC]
INSTEAD OF DELETE
AS
BEGIN
    -- Kiểm tra số sinh viên còn lại trong lớp
    IF EXISTS (
        SELECT d.[Tên học kì], d.[Mã môn học], d.[Tên lớp]
        FROM DELETED d
        JOIN [HỌC] h
            ON h.[Tên học kì] = d.[Tên học kì]
           AND h.[Mã môn học] = d.[Mã môn học]
           AND h.[Tên lớp] = d.[Tên lớp]
        GROUP BY d.[Tên học kì], d.[Mã môn học], d.[Tên lớp]
        HAVING COUNT(h.[Mã sinh viên]) <= 1
    )
    BEGIN
        THROW 50000, N'Không thể xóa. Mỗi lớp học phải có ít nhất 1 sinh viên.', 1;
    END

    -- Mỗi sinh viên phải còn ít nhất 1 lớp
    IF EXISTS (
        SELECT d.[Mã sinh viên]
        FROM DELETED d
        JOIN [HỌC] h
            ON h.[Mã sinh viên] = d.[Mã sinh viên]
        GROUP BY d.[Mã sinh viên]
        HAVING COUNT(h.[Tên học kì]) <= 1
    )
    BEGIN
        THROW 50001, N'Không thể xóa. Mỗi sinh viên phải học ít nhất 1 lớp.', 1;
    END

    -- Xóa bản ghi nếu hợp lệ
    DELETE h
    FROM [HỌC] h
    JOIN DELETED d
        ON h.[Mã sinh viên] = d.[Mã sinh viên]
       AND h.[Tên học kì] = d.[Tên học kì]
       AND h.[Mã môn học] = d.[Mã môn học]
       AND h.[Tên lớp] = d.[Tên lớp];
END
GO

-- ==============================
-- 2. Trigger trước khi update bản ghi HỌC
-- ==============================
CREATE TRIGGER trg_check_hoc_before_update
ON [HỌC]
INSTEAD OF UPDATE
AS
BEGIN
    -- Kiểm tra mỗi sinh viên cũ còn ít nhất 1 lớp
    IF EXISTS (
        SELECT d.[Mã sinh viên]
        FROM DELETED d
        JOIN [HỌC] h
            ON h.[Mã sinh viên] = d.[Mã sinh viên]
        GROUP BY d.[Mã sinh viên]
        HAVING COUNT(h.[Tên học kì]) <= 1
    )
    BEGIN
        THROW 50002, N'Không thể cập nhật. Mỗi sinh viên phải học ít nhất 1 lớp.', 1;
    END

    -- Kiểm tra mỗi lớp cũ còn ít nhất 1 sinh viên
    IF EXISTS (
        SELECT d.[Tên học kì], d.[Mã môn học], d.[Tên lớp]
        FROM DELETED d
        JOIN [HỌC] h
            ON h.[Tên học kì] = d.[Tên học kì]
           AND h.[Mã môn học] = d.[Mã môn học]
           AND h.[Tên lớp] = d.[Tên lớp]
        GROUP BY d.[Tên học kì], d.[Mã môn học], d.[Tên lớp]
        HAVING COUNT(h.[Mã sinh viên]) <= 1
    )
    BEGIN
        THROW 50003, N'Không thể cập nhật. Mỗi lớp học phải có ít nhất 1 sinh viên.', 1;
    END

    -- Thực hiện update nếu hợp lệ
    UPDATE h
    SET h.[Điểm tổng kết] = i.[Điểm tổng kết],
        h.[Ngày đăng kí] = i.[Ngày đăng kí],
        h.[Trạng thái học] = i.[Trạng thái học]
    FROM [HỌC] h
    JOIN INSERTED i
        ON h.[Mã sinh viên] = i.[Mã sinh viên]
       AND h.[Tên học kì] = i.[Tên học kì]
       AND h.[Mã môn học] = i.[Mã môn học]
       AND h.[Tên lớp] = i.[Tên lớp];
END
GO

-- =============================================
-- 1. Trigger trước khi insert Sinh viên (phải có lớp học)
-- =============================================
CREATE TRIGGER trg_check_sv_before_insert
ON [Sinh viên]
INSTEAD OF INSERT
AS
BEGIN
    IF EXISTS (
        SELECT i.[Mã EDUMEMBER]
        FROM INSERTED i
        LEFT JOIN [HỌC] h ON h.[Mã sinh viên] = i.[Mã EDUMEMBER]
        GROUP BY i.[Mã EDUMEMBER]
        HAVING COUNT(h.[Tên học kì]) < 1
    )
    BEGIN
        THROW 50000, N'Không thể thêm sinh viên chưa đăng ký học lớp nào.', 1;
    END

    -- Nếu hợp lệ, chèn vào Sinh viên
    INSERT INTO [Sinh viên]([Mã EDUMEMBER], [Lớp], [Chương trình], [Niên khóa], [Mã khoa])
    SELECT [Mã EDUMEMBER], [Lớp], [Chương trình], [Niên khóa], [Mã khoa]
    FROM INSERTED;
END
GO

-- =============================================
-- 2. Trigger trước khi insert Lớp học (phải có sinh viên)
-- =============================================
CREATE TRIGGER trg_check_lophoc_before_insert
ON [LỚP HỌC]
INSTEAD OF INSERT
AS
BEGIN
    IF EXISTS (
        SELECT i.[Tên học kì], i.[Mã môn học], i.[Tên lớp]
        FROM INSERTED i
        LEFT JOIN [HỌC] h
          ON h.[Tên học kì] = i.[Tên học kì]
         AND h.[Mã môn học] = i.[Mã môn học]
         AND h.[Tên lớp] = i.[Tên lớp]
        GROUP BY i.[Tên học kì], i.[Mã môn học], i.[Tên lớp]
        HAVING COUNT(h.[Mã sinh viên]) < 1
    )
    BEGIN
        THROW 50001, N'Không thể thêm lớp học chưa có sinh viên nào.', 1;
    END

    -- Nếu hợp lệ, chèn vào Lớp học
    INSERT INTO [LỚP HỌC]([Tên học kì], [Mã môn học], [Tên lớp], [Mã giảng viên], [Thứ], [Giờ học], [Địa điểm])
    SELECT [Tên học kì], [Mã môn học], [Tên lớp], [Mã giảng viên], [Thứ], [Giờ học], [Địa điểm]
    FROM INSERTED;
END
GO

-- =============================================
-- 3. Procedure insert Sinh viên cùng HỌC
-- =============================================
CREATE PROCEDURE insert_sinhvien_hoc
    @p_maSV INT,
    @p_lop VARCHAR(20),
    @p_ct VARCHAR(50),
    @p_nienkhoa INT,
    @p_makhoa VARCHAR(10),
    @p_tenkh VARCHAR(50),
    @p_mamh INT,
    @p_tenlop VARCHAR(50)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Insert vào bảng HỌC trước
        INSERT INTO [HỌC]([Mã sinh viên], [Tên học kì], [Mã môn học], [Tên lớp], [Điểm tổng kết], [Ngày đăng kí], [Trạng thái học])
        VALUES (@p_maSV, @p_tenkh, @p_mamh, @p_tenlop, NULL, GETDATE(), N'Đang học');

        -- Insert Sinh viên
        INSERT INTO [Sinh viên]([Mã EDUMEMBER], [Lớp], [Chương trình], [Niên khóa], [Mã khoa])
        VALUES (@p_maSV, @p_lop, @p_ct, @p_nienkhoa, @p_makhoa);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- =============================================
-- 4. Procedure insert Lớp học cùng HỌC
-- =============================================
CREATE PROCEDURE insert_lophoc_hoc
    @p_tenkh VARCHAR(50),
    @p_mamh INT,
    @p_tenlop VARCHAR(50),
    @p_magv INT,
    @p_maSV INT,
    @p_thu CHAR(2),
    @p_giohoc TIME,
    @p_diadiem VARCHAR(50)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Insert vào bảng HỌC trước
        INSERT INTO [HỌC]([Mã sinh viên], [Tên học kì], [Mã môn học], [Tên lớp], [Điểm tổng kết], [Ngày đăng kí], [Trạng thái học])
        VALUES (@p_maSV, @p_tenkh, @p_mamh, @p_tenlop, NULL, GETDATE(), N'Đang học');

        -- Insert Lớp học
        INSERT INTO [LỚP HỌC]([Tên học kì], [Mã môn học], [Tên lớp], [Mã giảng viên], [Thứ], [Giờ học], [Địa điểm])
        VALUES (@p_tenkh, @p_mamh, @p_tenlop, @p_magv, @p_thu, @p_giohoc, @p_diadiem);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- =============================================
-- 1. Trigger trước khi xóa ADMIN (mỗi thư viện phải còn ít nhất 1 ADMIN)
-- =============================================
CREATE TRIGGER trg_check_thuvien_before_delete
ON [Quản lý]
INSTEAD OF DELETE
AS
BEGIN
    IF EXISTS (
        SELECT d.[Mã thư viện]
        FROM DELETED d
        JOIN [Quản lý] q ON q.[Mã thư viện] = d.[Mã thư viện]
        GROUP BY d.[Mã thư viện]
        HAVING COUNT(q.[Mã ADMIN]) <= 1
    )
    BEGIN
        THROW 50000, N'Không thể xóa ADMIN. Mỗi Thư viện phải có ít nhất 1 ADMIN.', 1;
    END

    -- Nếu hợp lệ, xóa các bản ghi
    DELETE q
    FROM [Quản lý] q
    JOIN DELETED d
      ON q.[Mã ADMIN] = d.[Mã ADMIN]
     AND q.[Mã thư viện] = d.[Mã thư viện];
END
GO

-- =============================================
-- 2. Trigger trước khi update ADMIN (mỗi thư viện phải còn ít nhất 1 ADMIN)
-- =============================================
CREATE TRIGGER trg_check_thuvien_before_update
ON [Quản lý]
INSTEAD OF UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT d.[Mã thư viện]
        FROM DELETED d
        JOIN [Quản lý] q ON q.[Mã thư viện] = d.[Mã thư viện]
        GROUP BY d.[Mã thư viện]
        HAVING COUNT(q.[Mã ADMIN]) <= 1
    )
    BEGIN
        THROW 50001, N'Không thể thay đổi ADMIN. Mỗi Thư viện phải có ít nhất 1 ADMIN.', 1;
    END

    -- Nếu hợp lệ, thực hiện UPDATE
    UPDATE q
    SET q.[Mã ADMIN] = i.[Mã ADMIN],
        q.[Mã thư viện] = i.[Mã thư viện]
    FROM [Quản lý] q
    JOIN DELETED d ON q.[Mã ADMIN] = d.[Mã ADMIN] AND q.[Mã thư viện] = d.[Mã thư viện]
    JOIN INSERTED i ON i.[Mã ADMIN] = d.[Mã ADMIN] AND i.[Mã thư viện] = d.[Mã thư viện];
END
GO

-- =============================================
-- 3. Trigger trước khi insert Thư viện (phải có ADMIN)
-- =============================================
CREATE TRIGGER trg_check_thuvien_before_insert
ON [Thư viện]
INSTEAD OF INSERT
AS
BEGIN
    IF EXISTS (
        SELECT i.[Mã]
        FROM INSERTED i
        LEFT JOIN [Quản lý] q ON q.[Mã thư viện] = i.[Mã]
        GROUP BY i.[Mã]
        HAVING COUNT(q.[Mã ADMIN]) < 1
    )
    BEGIN
        THROW 50002, N'Không thể thêm thư viện. Mỗi thư viện phải có ít nhất 1 ADMIN.', 1;
    END

    -- Nếu hợp lệ, insert vào Thư viện
    INSERT INTO [Thư viện]([Mã], [Năm thành lập])
    SELECT [Mã], [Năm thành lập]
    FROM INSERTED;
END
GO

-- =============================================
-- 4. Procedure insert Thư viện cùng ADMIN
-- =============================================
CREATE PROCEDURE insert_thuvien
    @p_mathuvien INT,        -- Mã thư viện
    @p_namthanhlap INT,      -- Năm thành lập
    @p_maadmin INT           -- Mã ADMIN quản lý
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Chèn ADMIN quản lý vào [Quản lý] trước
        INSERT INTO [Quản lý]([Mã ADMIN], [Mã thư viện])
        VALUES (@p_maadmin, @p_mathuvien);

        -- Chèn thư viện
        INSERT INTO [Thư viện]([Mã], [Năm thành lập])
        VALUES (@p_mathuvien, @p_namthanhlap);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO
