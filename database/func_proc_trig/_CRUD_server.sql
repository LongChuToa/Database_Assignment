USE BTL_HCSDL;
GO

-- Xóa procedure cũ nếu tồn tại
IF OBJECT_ID('sp_insert_user', 'P') IS NOT NULL
    DROP PROCEDURE sp_insert_user;
GO

CREATE PROCEDURE sp_insert_user
    @p_id INT,
    @p_email VARCHAR(50),
    @p_username VARCHAR(50),
    @p_password VARCHAR(100),
    @p_hoten NVARCHAR(50),
    @p_diachi NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    -- 1) Kiểm tra ID chưa tồn tại
    IF EXISTS (SELECT 1 FROM [NGƯỜI DÙNG] WHERE [Mã] = @p_id)
    BEGIN
        THROW 50000, N'Lỗi: Mã người dùng đã tồn tại.', 1;
    END

    -- 2) Kiểm tra username unique
    IF EXISTS (SELECT 1 FROM [NGƯỜI DÙNG] WHERE [Tên đăng nhập] = @p_username)
    BEGIN
        THROW 50001, N'Lỗi: Tên đăng nhập đã tồn tại.', 1;
    END

    -- 3) Kiểm tra email hợp lệ
    IF @p_email IS NULL OR LTRIM(RTRIM(@p_email)) = ''
    BEGIN
        THROW 50002, N'Lỗi: Email không được để trống.', 1;
    END

    -- Sử dụng PATINDEX để kiểm tra định dạng email đơn giản
    IF (@p_email NOT LIKE '%[A-Za-z0-9._%+-]@[A-Za-z0-9.-]%.[A-Za-z]%')
    BEGIN
        THROW 50003, N'Lỗi: Email không hợp lệ...', 1;
    END



    -- 4) Kiểm tra mật khẩu
    IF @p_password IS NULL OR LTRIM(RTRIM(@p_password)) = ''
    BEGIN
        THROW 50004, N'Lỗi: Mật khẩu không được để trống.', 1;
    END

    IF LEN(@p_password) < 6
    BEGIN
        THROW 50005, N'Lỗi: Mật khẩu phải có độ dài >= 6 ký tự.', 1;
    END

    -- 5) Kiểm tra họ tên
    IF @p_hoten IS NULL OR LTRIM(RTRIM(@p_hoten)) = ''
    BEGIN
        THROW 50006, N'Lỗi: Họ và tên không được để trống.', 1;
    END

    -- 6) Thực hiện INSERT
    INSERT INTO [NGƯỜI DÙNG] ([Mã], [Email], [Tên đăng nhập], [Mật khẩu], [Họ và tên], [Địa chỉ])
    VALUES (@p_id, @p_email, @p_username, @p_password, @p_hoten, @p_diachi);
END
GO

USE BTL_HCSDL;
GO

IF OBJECT_ID('sp_update_user', 'P') IS NOT NULL
    DROP PROCEDURE sp_update_user;
GO

CREATE PROCEDURE sp_update_user
    @p_id INT,
    @p_email NVARCHAR(255) = NULL,
    @p_username NVARCHAR(100) = NULL,
    @p_password NVARCHAR(255) = NULL,
    @p_hoten NVARCHAR(255) = NULL,
    @p_diachi NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @v_exists INT;
    DECLARE @v_old_email NVARCHAR(255);
    DECLARE @v_old_username NVARCHAR(100);
    DECLARE @v_old_password NVARCHAR(255);
    DECLARE @v_old_hoten NVARCHAR(255);
    DECLARE @v_old_diachi NVARCHAR(255);

    DECLARE @v_new_email NVARCHAR(255);
    DECLARE @v_new_username NVARCHAR(100);
    DECLARE @v_new_password NVARCHAR(255);
    DECLARE @v_new_hoten NVARCHAR(255);
    DECLARE @v_new_diachi NVARCHAR(255);

    -- Kiểm tra tồn tại
    SELECT @v_exists = COUNT(*) FROM [NGƯỜI DÙNG] WHERE [Mã] = @p_id;
    IF @v_exists = 0
    BEGIN
        THROW 50001, N'Lỗi: Không tìm thấy người dùng để cập nhật.', 1;
    END

    -- Lấy dữ liệu cũ
    SELECT 
        @v_old_email = [Email],
        @v_old_username = [Tên đăng nhập],
        @v_old_password = [Mật khẩu],
        @v_old_hoten = [Họ và tên],
        @v_old_diachi = [Địa chỉ]
    FROM [NGƯỜI DÙNG]
    WHERE [Mã] = @p_id;

    -- Trim input (SQL Server 2017+)
    SET @p_email = NULLIF(LTRIM(RTRIM(@p_email)), '');
    SET @p_username = NULLIF(LTRIM(RTRIM(@p_username)), '');
    SET @p_password = NULLIF(LTRIM(RTRIM(@p_password)), '');
    SET @p_hoten = NULLIF(LTRIM(RTRIM(@p_hoten)), '');
    SET @p_diachi = NULLIF(LTRIM(RTRIM(@p_diachi)), '');

    -- Merge cũ + mới
    SET @v_new_email = ISNULL(@p_email, @v_old_email);
    SET @v_new_username = ISNULL(@p_username, @v_old_username);
    SET @v_new_password = ISNULL(@p_password, @v_old_password);
    SET @v_new_hoten = ISNULL(@p_hoten, @v_old_hoten);
    SET @v_new_diachi = ISNULL(@p_diachi, @v_old_diachi);

    -- VALIDATE: Username trùng
    IF @p_username IS NOT NULL
    BEGIN
        SELECT @v_exists = COUNT(*) 
        FROM [NGƯỜI DÙNG]
        WHERE [Tên đăng nhập] = @v_new_username AND [Mã] <> @p_id;

        IF @v_exists > 0
            THROW 50002, N'Lỗi: Tên đăng nhập cập nhật đã tồn tại.', 1;
    END

    -- VALIDATE: Email cơ bản
    IF @v_new_email IS NULL OR @v_new_email = ''
        THROW 50003, N'Lỗi: Email không được để trống.', 1;
    
    IF (@v_new_email NOT LIKE '%[A-Za-z0-9._%+-]@[A-Za-z0-9.-]%.[A-Za-z]%')
       THROW 50004, N'Lỗi: Email không hợp lệ (ví dụ: abc@xyz.com).', 1;

    -- VALIDATE: Password
    IF @p_password IS NOT NULL AND LEN(@p_password) < 6
        THROW 50005, N'Lỗi: Mật khẩu mới phải có độ dài >= 6 ký tự.', 1;

    -- VALIDATE: Họ tên
    IF @v_new_hoten IS NULL OR @v_new_hoten = ''
        THROW 50006, N'Lỗi: Họ và tên không được để trống.', 1;

    -- UPDATE
    UPDATE [NGƯỜI DÙNG]
    SET [Email] = @v_new_email,
        [Tên đăng nhập] = @v_new_username,
        [Mật khẩu] = @v_new_password,
        [Họ và tên] = @v_new_hoten,
        [Địa chỉ] = @v_new_diachi
    WHERE [Mã] = @p_id;
END
GO


USE BTL_HCSDL;
GO

IF OBJECT_ID('sp_delete_user', 'P') IS NOT NULL
    DROP PROCEDURE sp_delete_user;
GO

CREATE PROCEDURE sp_delete_user
    @p_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @v_cnt_admin INT = 0;
    DECLARE @v_cnt_edumember INT = 0;
    DECLARE @v_cnt_guitinnhan INT = 0;
    DECLARE @v_cnt_sdt INT = 0;
    DECLARE @v_msg NVARCHAR(MAX) = N'';
    DECLARE @v_exists INT;
    DECLARE @v_error_msg NVARCHAR(MAX);

    -- Kiểm tra user tồn tại
    SELECT @v_exists = COUNT(*) FROM [NGƯỜI DÙNG] WHERE [Mã] = @p_id;
    IF @v_exists = 0
    BEGIN
        SET @v_error_msg = N'Lỗi: Không tìm thấy người dùng để xóa.';
        THROW 50001, @v_error_msg, 1;
    END

    -- Kiểm tra ràng buộc
    SELECT @v_cnt_admin = COUNT(*) FROM [ADMIN] WHERE [Mã người dùng] = @p_id;
    SELECT @v_cnt_edumember = COUNT(*) FROM [EDUMEMBER] WHERE [Mã người dùng] = @p_id;
    SELECT @v_cnt_guitinnhan = COUNT(*) 
        FROM [Gửi tin nhắn] 
        WHERE [Mã người gửi] = @p_id OR [Mã người nhận] = @p_id;
    SELECT @v_cnt_sdt = COUNT(*) FROM [Số điện thoại người dùng] WHERE [Mã người dùng] = @p_id;

    -- Nối thông báo lỗi nếu có ràng buộc
    IF @v_cnt_admin > 0
        SET @v_msg = CONCAT(@v_msg, N'ADMIN(', @v_cnt_admin, N') ');
    IF @v_cnt_edumember > 0
        SET @v_msg = CONCAT(@v_msg, N'EDUMEMBER(', @v_cnt_edumember, N') ');
    IF @v_cnt_guitinnhan > 0
        SET @v_msg = CONCAT(@v_msg, N'TinNhan(', @v_cnt_guitinnhan, N') ');
    IF @v_cnt_sdt > 0
        SET @v_msg = CONCAT(@v_msg, N'SoDT(', @v_cnt_sdt, N') ');

    -- Nếu có ràng buộc, không cho xóa
    IF @v_msg <> N''
    BEGIN
        SET @v_error_msg = N'Không thể xóa! Dữ liệu đang được sử dụng tại: ' + @v_msg;
        THROW 50002, @v_error_msg, 1;
    END

    -- Xóa user
    DELETE FROM [NGƯỜI DÙNG] WHERE [Mã] = @p_id;
END
GO

