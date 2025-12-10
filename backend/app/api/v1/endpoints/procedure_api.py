from fastapi import APIRouter, HTTPException
from ....db.session import get_db_connection
from ....models.unified_models import UserDTO, UserUpdateDTO, StudentEnrollmentDTO
from pydantic import BaseModel
from datetime import date

router = APIRouter()

class ClassCreationDTO(BaseModel):
    semester: str
    subjectId: int
    className: str
    teacherId: int
    studentId: int  # Sinh viên đầu tiên của lớp
    day: str
    time: str
    room: str

class LibraryDTO(BaseModel):
    libraryId: int
    year: int
    adminId: int

class DocumentDTO(BaseModel):
    docId: int
    libraryId: int
    name: str
    date: str
    typeName: str


@router.get("/users")
def get_all_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM [NGƯỜI DÙNG]")
        columns = [column[0] for column in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]
    finally:
        conn.close()

@router.post("/users")
def create_user(item: UserDTO):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("{CALL sp_insert_user (?, ?, ?, ?, ?, ?)}", 
                       (item.id, item.email, item.username, item.password, item.fullName, item.address))
        conn.commit()
        return {"message": "✅ Thêm người dùng thành công (sp_insert_user)"}
    except Exception as e:
        conn.rollback()
        error_msg = str(e).split(']')[1] if ']' in str(e) else str(e)
        raise HTTPException(status_code=400, detail=error_msg)
    finally:
        conn.close()

@router.put("/users/{user_id}")
def update_user(user_id: int, item: UserUpdateDTO):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("{CALL sp_update_user (?, ?, ?, ?, ?, ?)}", 
                       (user_id, item.email, item.username, item.password, item.fullName, item.address))
        conn.commit()
        return {"message": "✅ Cập nhật thành công (sp_update_user)"}
    except Exception as e:
        conn.rollback()
        error_msg = str(e).split(']')[1] if ']' in str(e) else str(e)
        raise HTTPException(status_code=400, detail=error_msg)
    finally:
        conn.close()

@router.delete("/users/{user_id}")
def delete_user(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("{CALL sp_delete_user (?)}", (user_id,))
        conn.commit()
        return {"message": "✅ Xóa thành công (Hệ thống tự động dọn dẹp dữ liệu liên quan)"}

    except Exception as e:
        conn.rollback()
        error_msg = str(e).split(']')[1] if ']' in str(e) else str(e)
        raise HTTPException(status_code=400, detail=error_msg)
    finally:
        conn.close()

# --- NHẬP HỌC SINH VIÊN (User -> Edumember -> SinhVien/Hoc) ---
@router.post("/enrollment/student")
def enroll_student(item: StudentEnrollmentDTO):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        today = date.today()
        
        # B1: sp_insert_user
        cursor.execute("{CALL sp_insert_user (?, ?, ?, ?, ?, ?)}", 
                       (item.id, item.email, item.username, item.password, item.fullName, item.address))
        
        # B2: insert_edumember
        cursor.execute("{CALL insert_edumember (?, ?, ?)}", 
                       (item.id, today, item.adminId))
        
        # B3: insert_sinhvien_hoc
        cursor.execute("{CALL insert_sinhvien_hoc (?, ?, ?, ?, ?, ?, ?, ?)}", 
                       (item.id, item.className, item.program, item.cohort, item.facultyId, 
                        item.semester, item.subjectId, item.enrollClass))

        conn.commit()
        return {"message": "✅ Nhập học hoàn tất"}
    
    except Exception as e:
        conn.rollback()
        error_msg = str(e).split(']')[1] if ']' in str(e) else str(e)
        raise HTTPException(status_code=400, detail=error_msg)
    finally:
        conn.close()

# --- MỞ LỚP HỌC MỚI (Lớp -> Học) ---
@router.post("/classes")
def create_class(item: ClassCreationDTO):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("{CALL insert_lophoc_hoc (?, ?, ?, ?, ?, ?, ?, ?)}", 
                       (item.semester, item.subjectId, item.className, item.teacherId, 
                        item.studentId, item.day, item.time, item.room))
        conn.commit()
        return {"message": "✅ Mở lớp thành công (Đã tạo Lớp và thêm 1 SV vào)"}
    except Exception as e:
        conn.rollback()
        error_msg = str(e).split(']')[1] if ']' in str(e) else str(e)
        raise HTTPException(status_code=400, detail=error_msg)
    finally:
        conn.close()

# --- THÊM TÀI LIỆU (Tài liệu -> Loại) ---
@router.post("/documents")
def create_document(item: DocumentDTO):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("{CALL insert_tailieu (?, ?, ?, ?, ?)}", 
                       (item.docId, item.libraryId, item.name, item.date, item.typeName))
        conn.commit()
        return {"message": "✅ Thêm tài liệu thành công (Đã tạo Tài liệu và Loại)"}
    except Exception as e:
        conn.rollback()
        error_msg = str(e).split(']')[1] if ']' in str(e) else str(e)
        raise HTTPException(status_code=400, detail=error_msg)
    finally:
        conn.close()

# --- THÊM THƯ VIỆN (Thư viện -> Quản lý) ---
@router.post("/libraries")
def create_library(item: LibraryDTO):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("{CALL insert_thuvien (?, ?, ?)}", 
                       (item.libraryId, item.year, item.adminId))
        conn.commit()
        return {"message": "✅ Thêm thư viện thành công (Đã tạo Thư viện và gán Admin)"}
    except Exception as e:
        conn.rollback()
        error_msg = str(e).split(']')[1] if ']' in str(e) else str(e)
        raise HTTPException(status_code=400, detail=error_msg)
    finally:
        conn.close()


# Lấy danh sách Sinh viên (JOIN Người dùng + Khoa)
@router.get("/view/students")
def view_students():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """
        SELECT 
            sv.[Mã EDUMEMBER] as ID,
            u.[Họ và tên] as Name,
            u.[Email],
            sv.[Lớp] as Class,
            sv.[Chương trình] as Program,
            k.[Tên] as FacultyName
        FROM [Sinh viên] sv
        JOIN [NGƯỜI DÙNG] u ON sv.[Mã EDUMEMBER] = u.[Mã]
        LEFT JOIN [KHOA] k ON sv.[Mã khoa] = k.[Mã]
        ORDER BY sv.[Mã EDUMEMBER] DESC
        """
        cursor.execute(query)
        columns = [column[0] for column in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]
    finally:
        conn.close()

# Lấy danh sách Lớp học (JOIN Môn học + Giảng viên)
@router.get("/view/classes")
def view_classes():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """
        SELECT 
            lh.[Tên học kì] as Semester,
            mh.[Tên] as SubjectName,
            lh.[Tên lớp] as ClassName,
            u.[Họ và tên] as Lecturer,
            lh.[Phòng] as Room, -- Lưu ý: Kiểm tra lại tên cột trong DB (Địa điểm/Phòng)
            lh.[Thứ] as Day,
            lh.[Giờ học] as Time
        FROM [LỚP HỌC] lh
        JOIN [MÔN HỌC] mh ON lh.[Mã môn học] = mh.[Mã]
        JOIN [NGƯỜI DÙNG] u ON lh.[Mã giảng viên] = u.[Mã]
        ORDER BY lh.[Tên học kì] DESC
        """
        # Lưu ý: Nếu cột là [Địa điểm] thì sửa query trên
        cursor.execute(query.replace("[Phòng]", "[Địa điểm]")) 
        columns = [column[0] for column in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]
    finally:
        conn.close()

# Lấy danh sách Tài liệu (JOIN Thư viện + Loại)
@router.get("/view/documents")
def view_documents():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """
        SELECT 
            tl.[Mã] as DocID,
            tl.[Tên] as DocName,
            tl.[Ngày xuất bản] as PubDate,
            tv.[Năm thành lập] as LibYear,
            STRING_AGG(tltv.[Tên loại tài liệu], ', ') as Types -- Gom nhóm loại tài liệu
        FROM [Tài liệu] tl
        JOIN [Thư viện] tv ON tl.[Mã thư viện] = tv.[Mã]
        LEFT JOIN [TL THUỘC VỀ] tltv ON tl.[Mã] = tltv.[Mã tài liệu]
        GROUP BY tl.[Mã], tl.[Tên], tl.[Ngày xuất bản], tv.[Năm thành lập]
        ORDER BY tl.[Mã] DESC
        """
        cursor.execute(query)
        columns = [column[0] for column in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]
    finally:
        conn.close()

# Lấy danh sách Thư viện (JOIN Admin quản lý)
@router.get("/view/libraries")
def view_libraries():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """
        SELECT 
            tv.[Mã] as LibID,
            tv.[Năm thành lập] as Year,
            u.[Họ và tên] as AdminName,
            u.[Email] as AdminEmail
        FROM [Thư viện] tv
        JOIN [Quản lý] ql ON tv.[Mã] = ql.[Mã thư viện]
        JOIN [NGƯỜI DÙNG] u ON ql.[Mã ADMIN] = u.[Mã]
        ORDER BY tv.[Mã] DESC
        """
        cursor.execute(query)
        columns = [column[0] for column in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]
    finally:
        conn.close()

# Tính tổng tín chỉ tích lũy
@router.get("/functions/credits")
def get_total_credits(studentId: int, passScore: float = 4.0):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT dbo.fn_TinhTongTinChiHoanThanh(?, ?)", (studentId, passScore))
        result = cursor.fetchone()
        return {"studentId": studentId, "totalCredits": result[0] if result else 0}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# Kiểm tra trạng thái học tập
@router.get("/functions/status")
def check_status(studentId: int, semester: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT dbo.fn_KiemTraTrangThaiHocTap(?, ?)", (studentId, semester))
        result = cursor.fetchone()
        return {"studentId": studentId, "semester": semester, "status": result[0] if result else "Không xác định"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# =================================================================
# QUẢN LÝ ĐIỂM & THỐNG KÊ
# =================================================================

# Gọi SP: Lấy danh sách sinh viên đạt điểm (Tìm kiếm)
@router.get("/procedures/student-grades")
def get_student_grades(semester: str, subjectId: int, className: str, minScore: float):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Gọi SP: sp_LayDSSVDatDiemTrongLop
        cursor.execute("{CALL sp_LayDSSVDatDiemTrongLop (?, ?, ?, ?)}", 
                       (semester, subjectId, className, minScore))
        columns = [column[0] for column in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]
    except Exception as e:
        # Xử lý lỗi logic từ SP (VD: Điểm < 0)
        error_msg = str(e)
        if "SQL Server" in error_msg:
             error_msg = error_msg.split("]")[1] if "]" in error_msg else error_msg
        raise HTTPException(status_code=400, detail=error_msg)
    finally:
        conn.close()

# Gọi SP: Thống kê môn học (Report)
@router.get("/procedures/subject-stats")
def get_subject_stats(threshold: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Gọi SP: sp_ThongKeMonHocCoNhieuSV
        cursor.execute("{CALL sp_ThongKeMonHocCoNhieuSV (?)}", (threshold,))
        columns = [column[0] for column in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]
    except Exception as e:
        error_msg = str(e).split(']')[1] if ']' in str(e) else str(e)
        raise HTTPException(status_code=400, detail=error_msg)
    finally:
        conn.close()

# Cập nhật Điểm (Feature Update cho danh sách trên)
class GradeUpdateDTO(BaseModel):
    studentId: int
    semester: str
    subjectId: int
    className: str
    newScore: float

@router.put("/grades/update")
def update_student_grade(item: GradeUpdateDTO):
    if item.newScore < 0 or item.newScore > 10:
         raise HTTPException(status_code=400, detail="Điểm số phải nằm trong khoảng 0 - 10")

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Update trực tiếp bảng HỌC
        cursor.execute("""
            UPDATE [HỌC] 
            SET [Điểm tổng kết] = ?
            WHERE [Mã sinh viên] = ? AND [Tên học kì] = ? AND [Mã môn học] = ? AND [Tên lớp] = ?
        """, (item.newScore, item.studentId, item.semester, item.subjectId, item.className))
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy bản ghi để cập nhật")
            
        conn.commit()
        return {"message": "✅ Cập nhật điểm thành công!"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# Xóa đăng ký học (Feature Delete cho danh sách trên)
@router.delete("/grades/delete")
def delete_student_enrollment(studentId: int, semester: str, subjectId: int, className: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Delete trực tiếp bảng HỌC
        cursor.execute("""
            DELETE FROM [HỌC] 
            WHERE [Mã sinh viên] = ? AND [Tên học kì] = ? AND [Mã môn học] = ? AND [Tên lớp] = ?
        """, (studentId, semester, subjectId, className))
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy bản ghi để xóa")

        conn.commit()
        return {"message": "✅ Đã xóa sinh viên khỏi lớp học!"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@router.get("/helpers/options")
def get_helper_options():
    """Lấy toàn bộ danh sách lựa chọn cho Frontend trong 1 lần gọi"""
    conn = get_db_connection()
    cursor = conn.cursor()
    data = {}
    try:
        # 1. Danh sách Học kì
        cursor.execute("SELECT [Tên học kì] FROM [HỌC KÌ] ORDER BY [Tên học kì] DESC")
        data['semesters'] = [row[0] for row in cursor.fetchall()]

        # 2. Danh sách Khoa
        cursor.execute("SELECT [Mã], [Tên] FROM [KHOA]")
        data['faculties'] = [dict(zip(['id', 'name'], row)) for row in cursor.fetchall()]

        # 3. Danh sách Môn học
        cursor.execute("SELECT [Mã], [Tên] FROM [MÔN HỌC]")
        data['subjects'] = [dict(zip(['id', 'name'], row)) for row in cursor.fetchall()]

        # 4. Danh sách Tên lớp (Distinct)
        cursor.execute("SELECT DISTINCT [Tên lớp] FROM [LỚP HỌC]")
        data['classNames'] = [row[0] for row in cursor.fetchall()]

        # 5. Danh sách Loại tài liệu
        cursor.execute("SELECT [Tên] FROM [LOẠI TÀI LIỆU]")
        data['docTypes'] = [row[0] for row in cursor.fetchall()]

        # 6. Danh sách Thư viện
        cursor.execute("SELECT [Mã], [Năm thành lập] FROM [Thư viện]")
        data['libraries'] = [dict(zip(['id', 'year'], row)) for row in cursor.fetchall()]

        # 7. Danh sách Admin (Để chọn người giám sát)
        cursor.execute("SELECT a.[Mã người dùng], u.[Họ và tên] FROM [ADMIN] a JOIN [NGƯỜI DÙNG] u ON a.[Mã người dùng] = u.[Mã]")
        data['admins'] = [dict(zip(['id', 'name'], row)) for row in cursor.fetchall()]

        # 8. Danh sách Giảng viên
        cursor.execute("SELECT g.[Mã EDUMEMBER], u.[Họ và tên] FROM [GIẢNG VIÊN] g JOIN [NGƯỜI DÙNG] u ON g.[Mã EDUMEMBER] = u.[Mã]")
        data['teachers'] = [dict(zip(['id', 'name'], row)) for row in cursor.fetchall()]

        # 9. Danh sách Sinh viên
        cursor.execute("SELECT s.[Mã EDUMEMBER], u.[Họ và tên] FROM [Sinh viên] s JOIN [NGƯỜI DÙNG] u ON s.[Mã EDUMEMBER] = u.[Mã]")
        data['students'] = [dict(zip(['id', 'name'], row)) for row in cursor.fetchall()]

        return data
    finally:
        conn.close()