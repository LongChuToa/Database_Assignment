CREATE TABLE IF NOT EXISTS `KHOA` (
	`Mã` INT PRIMARY KEY,
	`Tên` VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci UNIQUE,
	`Email` VARCHAR(50) UNIQUE,
	`Năm thành lập` DATE,
	`Số điện thoại` VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS `TÁC GIẢ TÀI LIỆU` (
	`Mã tài liệu` INT,
	`Tên tác giả` VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci,
    PRIMARY KEY(`Mã tài liệu`,`Tên tác giả`)
);

CREATE TABLE IF NOT EXISTS `GIẢNG VIÊN` (
	`Mã EDUMEMBER` INT PRIMARY KEY,
    `Học vị` VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci,
    `Chức danh` VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci,
    `Lĩnh vực` VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci,
    `Số năm kinh nghiệm` INT,
    `Mã khoa` INT NOT NULL
);

CREATE TABLE IF NOT EXISTS `MÔN HỌC` (
	`Mã` INT PRIMARY KEY,
    `Tên` VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci,
    `Số tín chỉ` INT,
    `Mô tả` VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci
);

CREATE TABLE IF NOT EXISTS `TL THUỘC VỀ` (
	`Mã tài liệu` INT,
    `Tên loại tài liệu` VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci,
    PRIMARY KEY (`Mã tài liệu`,`Tên loại tài liệu`)
);

CREATE TABLE IF NOT EXISTS `LOẠI TÀI LIỆU` (
	`Tên` VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci PRIMARY KEY,
    `Tên cha` VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci
);

CREATE TABLE IF NOT EXISTS `HỌC KÌ` (
	`Tên học kì` VARCHAR(50) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS `LỚP HỌC` (
	`Tên học kì` VARCHAR(50),
    `Mã môn học` INT,
    `Tên lớp` VARCHAR(50),
    `Mã giảng viên` INT NOT NULL,
    `Thứ` ENUM('2','3','4','5','6','7','CN'),
	`Giờ học` TIME,
    `Địa điểm` VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci,
    PRIMARY KEY (`Tên học kì`, `Mã môn học`, `Tên lớp`)
);

CREATE TABLE IF NOT EXISTS `Tài liệu lớp học` (
	`Tên học kì` VARCHAR(50),
    `Mã môn học` INT,
    `Tên lớp` VARCHAR(50),
    `Mã tài liệu` INT,
    `Tên` VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci,
    `Mô tả` VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci,
    PRIMARY KEY (`Tên học kì`, `Mã môn học`, `Tên lớp`, `Mã tài liệu`)
);

CREATE TABLE IF NOT EXISTS `TLLH THUỘC VỀ` (
	`Tên học kì` VARCHAR(50),
    `Mã môn học` INT,
    `Tên lớp` VARCHAR(50),
    `Mã tài liệu lớp học` INT,
    `Tên loại tài liệu` VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci,
    PRIMARY KEY (`Tên học kì`, `Mã môn học`, `Tên lớp`, `Mã tài liệu lớp học`, `Tên loại tài liệu`)
);

CREATE TABLE IF NOT EXISTS `HỌC` (
	`Mã sinh viên` INT,
    `Tên học kì` VARCHAR(50),
    `Mã môn học` INT,
    `Tên lớp` VARCHAR(50),
    `Điểm tổng kết` INT,
    `Ngày đăng kí` DATE,
    `Trạng thái học` VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci,
    PRIMARY KEY (`Mã sinh viên`, `Tên học kì`, `Mã môn học`, `Tên lớp`)
);

CREATE TABLE IF NOT EXISTS `BÀI TẬP` (
	`Tên học kì` VARCHAR(50),
    `Mã môn học` INT,
    `Tên lớp` VARCHAR(50),
    `Mã bài tập` INT,
    `Tùy chọn` VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci,
    `Hình thức làm bài` VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci,
    `Tên bài` VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci,
    `Mô tả` VARCHAR(50) CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci,
    `Thời gian bắt đầu` DATE,
    `Thời gian kết thúc` DATE,
    PRIMARY KEY (`Tên học kì`, `Mã môn học`, `Tên lớp`, `Mã bài tập`)
);

CREATE TABLE IF NOT EXISTS `THAM GIA LÀM` (
	`Mã sinh viên` INT,
    `Tên học kì` VARCHAR(50),
    `Mã môn học` INT,
    `Tên lớp` VARCHAR(50),
    `Mã bài tập` INT,
    `Thời gian nộp bài` DATETIME,
    `Điểm số` DECIMAL(10,2),
    PRIMARY KEY (`Mã sinh viên`, `Tên học kì`, `Mã môn học`, `Tên lớp`, `Mã bài tập`)
);

DROP TABLE IF EXISTS `Truy cập`;
DROP TABLE IF EXISTS `Sinh viên`;
DROP TABLE IF EXISTS `Giám sát`;
DROP TABLE IF EXISTS EDUMEMBER;
DROP TABLE IF EXISTS `Quản lý`;
DROP TABLE IF EXISTS ADMIN;
DROP TABLE IF EXISTS `Số điện thoại người dùng`;
DROP TABLE IF EXISTS `Tin nhắn`;
DROP TABLE IF EXISTS `Gửi tin nhắn`;
DROP TABLE IF EXISTS `Tài liệu`;
DROP TABLE IF EXISTS `Số điện thoại thư viện`;
DROP TABLE IF EXISTS `Thư viện`;
DROP TABLE IF EXISTS `NGƯỜI DÙNG`;
 CREATE TABLE `NGƯỜI DÙNG`(
    `Mã` INT PRIMARY KEY,
    Email VARCHAR(50),
    `Tên đăng nhập` VARCHAR(50) not null UNIQUE,
    `Mật khẩu` VARCHAR(100) not null,
    `Họ và tên` VARCHAR(50) character set utf8mb4 collate utf8mb4_vietnamese_ci,
    `Địa chỉ` VARCHAR(100) character set utf8mb4 collate utf8mb4_vietnamese_ci
);

CREATE TABLE `Thư viện`(
    `Mã` INT PRIMARY KEY,
    `Năm thành lập` Year
);

    CREATE TABLE `Số điện thoại thư viện`(
        `Mã thư viện` INT,
        `Số điện thoại` VARCHAR(15),
        PRIMARY KEY (`Mã thư viện`, `Số điện thoại`)
    /* FOREIGN KEY (`Mã thư viện`) 
            REFERENCES `Thư viện`(`Mã`)
            ON DELETE CASCADE`
            ON UPDATE CASCADE */
    );

    CREATE TABLE `Tài liệu`(
        `Mã` INT PRIMARY KEY,
        `Mã thư viện` INT,
        `Tên` VARCHAR(100) character set utf8mb4 collate utf8mb4_vietnamese_ci,
        `Ngày xuất bản` DATE
        /* FOREIGN KEY (`Mã thư viện`) 
            REFERENCES `Thư viện`(`Mã`)
            ON DELETE CASCADE
            ON UPDATE CASCADE */
    );

    CREATE TABLE `Gửi tin nhắn`(
        `Mã người gửi` INT,
        `Mã người nhận` INT,
        PRIMARY KEY (`Mã người gửi`, `Mã người nhận`)
    /* FOREIGN KEY (`Mã người gửi`) 
            REFERENCES `NGƯỜI DÙNG`(`Mã`)
            ON DELETE RESTRICT
            ON UPDATE CASCADE,
            
        FOREIGN KEY (`Mã người nhận`) 
            REFERENCES `NGƯỜI DÙNG`(`Mã`)
            ON DELETE RESTRICT
            ON UPDATE CASCADE */
    );

        CREATE TABLE `Tin nhắn`(
            `Mã người gửi` INT,
            `Mã người nhận` INT,
            `Nội dung` TEXT character set utf8mb4 collate utf8mb4_vietnamese_ci,
            `Thời gian` DATETIME,
            PRIMARY KEY (`Mã người gửi`, `Mã người nhận`, `Thời gian`)
            /* FOREIGN KEY (`Mã người gửi`) 
                REFERENCES `Gửi tin nhắn`(`Mã người gửi`)
                ON DELETE RESTRICT
                ON UPDATE CASCADE,
                
            FOREIGN KEY (`Mã người nhận`) 
                REFERENCES `Gửi tin nhắn`(`Mã người nhận`)
                ON DELETE RESTRICT
                ON UPDATE CASCADE */
        );

    CREATE TABLE `Số điện thoại người dùng`(
        `Mã người dùng` INT,
        `Số điện thoại` VARCHAR(15),
        PRIMARY KEY (`Mã người dùng`, `Số điện thoại`)
    /* FOREIGN KEY (`Mã người dùng`) 
            REFERENCES `NGƯỜI DÙNG`(`Mã`)
            ON DELETE CASCADE
            ON UPDATE CASCADE */
    );

    CREATE TABLE ADMIN(
        `Mã người dùng` INT PRIMARY KEY,
        `Cấp độ quyền` INT,
        `Trạng thái quyền` VARCHAR(50) character set utf8mb4 collate utf8mb4_vietnamese_ci,
        `Ngày bắt đầu quản trị` DATE
        /*Foreign Key (`Mã người dùng`)
            References `NGƯỜI DÙNG`(`Mã`)
            ON DELETE CASCADE
            ON UPDATE CASCADE */
    );
        CREATE TABLE `Quản lý`( -- Check total Thư viện
            `Mã ADMIN` INT,
            `Mã thư viện` INT,
            PRIMARY KEY (`Mã ADMIN`, `Mã thư viện`)
        /* FOREIGN KEY (`Mã ADMIN`) 
                REFERENCES ADMIN(`Mã người dùng`)
                ON DELETE CASCADE
                ON UPDATE CASCADE,
                
            FOREIGN KEY (`Mã thư viện`) 
                REFERENCES `Thư viện`(`Mã`)
                ON DELETE CASCADE
                ON UPDATE CASCADE */
        );
    CREATE TABLE EDUMEMBER(
        `Mã người dùng` INT PRIMARY KEY,
        `Ngày tham gia` DATE,
        `Trạng thái hoạt động` BOOLEAN DEFAULT TRUE
        /*Foreign Key (`Mã người dùng`)
            References `NGƯỜI DÙNG`(`Mã`)
            ON DELETE CASCADE
            ON UPDATE CASCADE */
    );
        CREATE TABLE `Giám sát`( -- Check total EduMember
            `Mã ADMIN` INT,
            `Mã EDUMEMBER` INT,
            PRIMARY KEY (`Mã ADMIN`, `Mã EDUMEMBER`)
        /*  FOREIGN KEY (`Mã ADMIN`) 
                REFERENCES ADMIN(`Mã người dùng`)
                ON DELETE CASCADE
                ON UPDATE CASCADE,
                
            FOREIGN KEY (`Mã EDUMEMBER`) 
                REFERENCES EDUMEMBER(`Mã người dùng`)
                ON DELETE CASCADE
                ON UPDATE CASCADE */ 
        );
        CREATE TABLE `Sinh viên`(             -- Check not null Mã khoa
            `Mã EDUMEMBER` INT PRIMARY KEY,
            `Lớp` VARCHAR(20) character set utf8mb4 collate utf8mb4_vietnamese_ci,
            `Chương trình` VARCHAR(50) character set utf8mb4 collate utf8mb4_vietnamese_ci,
            `Niên khóa` YEAR,
            `Mã khoa` VARCHAR(10)
            /* FOREIGN KEY (`Mã EDUMEMBER`) 
                REFERENCES EDUMEMBER(`Mã người dùng`)
                ON DELETE CASCADE
                ON UPDATE CASCADE */
        );

        CREATE TABLE `Truy cập`(
            `Mã EDUMEMBER` INT,
            `Mã tài liệu` INT,
            `Thời gian` DATETIME,
            PRIMARY KEY (`Mã EDUMEMBER`, `Mã tài liệu`, `Thời gian`)
            /*  FOREIGN KEY (`Mã EDUMEMBER`)
                    REFERENCES EDUMEMBER(`Mã người dùng`)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                FOREIGN KEY (`Mã tài liệu`)
                    REFERENCES `Tài liệu`(`Mã`)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE */
        );


    





