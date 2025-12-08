from fastapi import APIRouter, HTTPException
from ....db.session import get_db_connection
from ....models.class_model import ClassModel
from pydantic import BaseModel # <--- Thêm import này

router = APIRouter()

# --- ĐỊNH NGHĨA MODEL TẠI CHỖ (Để tránh lỗi import) ---
class ReportRequest(BaseModel):
    semester: str
    subjectId: int
    className: str

# --- MODEL PHỤ TRỢ ---
class ClassRequest(BaseModel):
    semester: str
    subjectId: int
    className: str

# =================================================================
# 1. API LẤY DỮ LIỆU CHO DROPDOWN (Học kì, Môn, Giảng viên)
# =================================================================
@router.get("/lists/options")
def get_options():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        data = {}
        
        # 1. Lấy danh sách Học kì
        cursor.execute("SELECT [Tên học kì] FROM [HỌC KÌ]")
        data['semesters'] = [row[0] for row in cursor.fetchall()]

        # 2. Lấy danh sách Môn học
        cursor.execute("SELECT [Mã], [Tên] FROM [MÔN HỌC]")
        data['subjects'] = [{"id": row[0], "name": row[1]} for row in cursor.fetchall()]

        # 3. Lấy danh sách Giảng viên (Join với Người dùng để lấy tên)
        cursor.execute("""
            SELECT gv.[Mã EDUMEMBER], nd.[Họ và tên] 
            FROM [GIẢNG VIÊN] gv
            JOIN [NGƯỜI DÙNG] nd ON gv.[Mã EDUMEMBER] = nd.[Mã]
        """)
        data['lecturers'] = [{"id": row[0], "name": row[1]} for row in cursor.fetchall()]

        return data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# =================================================================
# 2. API XEM CHI TIẾT LỚP (Giảng viên + Danh sách Sinh viên)
# =================================================================
@router.post("/classes/details")
def get_class_details(req: ClassRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # 1. Lấy tên Giảng viên của lớp
        cursor.execute("""
            SELECT nd.[Họ và tên]
            FROM [LỚP HỌC] lh
            JOIN [NGƯỜI DÙNG] nd ON lh.[Mã giảng viên] = nd.[Mã]
            WHERE lh.[Tên học kì] = ? AND lh.[Mã môn học] = ? AND lh.[Tên lớp] = ?
        """, (req.semester, req.subjectId, req.className))
        row = cursor.fetchone()
        lecturer_name = row[0] if row else "Chưa phân công"

        # 2. Lấy danh sách Sinh viên trong lớp
        cursor.execute("""
            SELECT sv.[Mã EDUMEMBER], nd.[Họ và tên], h.[Trạng thái học]
            FROM [HỌC] h
            JOIN [Sinh viên] sv ON h.[Mã sinh viên] = sv.[Mã EDUMEMBER]
            JOIN [NGƯỜI DÙNG] nd ON sv.[Mã EDUMEMBER] = nd.[Mã]
            WHERE h.[Tên học kì] = ? AND h.[Mã môn học] = ? AND h.[Tên lớp] = ?
        """, (req.semester, req.subjectId, req.className))
        
        columns = [column[0] for column in cursor.description]
        students = []
        for row in cursor.fetchall():
            students.append(dict(zip(columns, row)))

        return {
            "lecturer": lecturer_name,
            "students": students
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# =================================================================
# 3. CÁC API CŨ (Search, Create, Delete)
# =================================================================

@router.post("/classes/search")
def search_classes(keyword: str = "", semester: str = ""):
    conn = get_db_connection()
    if not conn: raise HTTPException(status_code=500, detail="DB Connection Failed")
    cursor = conn.cursor()
    try:
        sql = """
            SELECT lh.[Tên học kì], lh.[Mã môn học], mh.[Tên] AS [Tên môn], 
                   lh.[Tên lớp], lh.[Mã giảng viên], nd.[Họ và tên] as [Tên GV],
                   lh.[Thứ], CONVERT(varchar(5), lh.[Giờ học], 108) as [Giờ học], lh.[Địa điểm]
            FROM [LỚP HỌC] lh
            JOIN [MÔN HỌC] mh ON lh.[Mã môn học] = mh.[Mã]
            LEFT JOIN [NGƯỜI DÙNG] nd ON lh.[Mã giảng viên] = nd.[Mã]
            WHERE 1=1
        """
        params = []
        if semester and semester != "All":
            sql += " AND lh.[Tên học kì] = ?"
            params.append(semester)
        if keyword:
            sql += " AND mh.[Tên] LIKE ?"
            params.append(f"%{keyword}%")

        cursor.execute(sql, params)
        columns = [column[0] for column in cursor.description]
        results = []
        for row in cursor.fetchall():
            results.append(dict(zip(columns, row)))
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@router.post("/classes/create")
def create_class(item: ClassModel):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # BẮT ĐẦU GIAO DỊCH
        # 1. KIỂM TRA SINH VIÊN CÓ TỒN TẠI KHÔNG? (Quan trọng)
        cursor.execute("SELECT COUNT(*) FROM [SINH VIÊN] WHERE [Mã EDUMEMBER] = ?", (item.firstStudentId,))
        if cursor.fetchone()[0] == 0:
            raise Exception(f"Mã sinh viên {item.firstStudentId} không tồn tại trong hệ thống!")

        # 2. KIỂM TRA GIẢNG VIÊN CÓ TỒN TẠI KHÔNG?
        cursor.execute("SELECT COUNT(*) FROM [GIẢNG VIÊN] WHERE [Mã EDUMEMBER] = ?", (item.lecturerId,))
        if cursor.fetchone()[0] == 0:
            raise Exception(f"Mã giảng viên {item.lecturerId} không tồn tại!")

        # 3. TẮT TẠM THỜI RÀNG BUỘC KHÓA NGOẠI CỦA BẢNG 'HỌC'
        # (Để insert được vào bảng HỌC trước khi bảng LỚP HỌC có dữ liệu - Giải quyết vòng lặp gà-trứng)
        cursor.execute("ALTER TABLE [HỌC] NOCHECK CONSTRAINT [fk_hoc_lophoc]")

        # 4. INSERT VÀO BẢNG 'HỌC' (Sinh viên đăng ký)
        # Lưu ý: Insert vào bảng con trước để thỏa mãn Trigger của LỚP HỌC
        sql_hoc = """
            INSERT INTO [HỌC] ([Mã sinh viên], [Tên học kì], [Mã môn học], [Tên lớp], [Điểm tổng kết], [Ngày đăng kí], [Trạng thái học])
            VALUES (?, ?, ?, ?, NULL, GETDATE(), N'Đang học')
        """
        cursor.execute(sql_hoc, (item.firstStudentId, item.semester, item.subjectId, item.className))

        # 5. INSERT VÀO BẢNG 'LỚP HỌC'
        sql_lop = """
            INSERT INTO [LỚP HỌC] ([Tên học kì], [Mã môn học], [Tên lớp], [Mã giảng viên], [Thứ], [Giờ học], [Địa điểm])
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        cursor.execute(sql_lop, (
            item.semester, item.subjectId, item.className, 
            item.lecturerId, item.day, item.time, item.location
        ))

        # 6. BẬT LẠI RÀNG BUỘC KHÓA NGOẠI
        cursor.execute("ALTER TABLE [HỌC] CHECK CONSTRAINT [fk_hoc_lophoc]")

        conn.commit() # Lưu tất cả thay đổi
        return {"message": "Tạo lớp và thêm sinh viên thành công!"}

    except Exception as e:
        conn.rollback() # Hủy bỏ nếu có lỗi
        # Bật lại khóa ngoại đề phòng trường hợp lỗi giữa chừng
        try: cursor.execute("ALTER TABLE [HỌC] CHECK CONSTRAINT [fk_hoc_lophoc]")
        except: pass
        
        print(f"Lỗi Create Class: {e}") # In lỗi ra terminal server để bạn đọc
        
        # Xử lý thông báo lỗi đẹp hơn cho Frontend
        error_msg = str(e)
        if "PRIMARY KEY" in error_msg:
            error_msg = "Lớp học này đã tồn tại (Trùng Học kì, Môn và Tên lớp)."
        elif "FOREIGN KEY" in error_msg:
            error_msg = "Dữ liệu tham chiếu (Môn học/Học kỳ) không hợp lệ."
            
        raise HTTPException(status_code=400, detail=error_msg)
    finally:
        conn.close()

@router.delete("/classes/delete")
def delete_class(semester: str, subjectId: int, className: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Xóa tuần tự để đảm bảo sạch dữ liệu (Manual Cascade)
        params = (semester, subjectId, className)
        
        # 1. Xóa các bảng con/cháu
        cursor.execute("DELETE FROM [THAM GIA LÀM] WHERE [Tên học kì]=? AND [Mã môn học]=? AND [Tên lớp]=?", params)
        cursor.execute("DELETE FROM [BÀI TẬP] WHERE [Tên học kì]=? AND [Mã môn học]=? AND [Tên lớp]=?", params)
        cursor.execute("DELETE FROM [TLLH THUỘC VỀ] WHERE [Tên học kì]=? AND [Mã môn học]=? AND [Tên lớp]=?", params)
        cursor.execute("DELETE FROM [Tài liệu lớp học] WHERE [Tên học kì]=? AND [Mã môn học]=? AND [Tên lớp]=?", params)
        
        # 2. Xóa Sinh viên trong lớp (Bảng HỌC)
        cursor.execute("DELETE FROM [HỌC] WHERE [Tên học kì]=? AND [Mã môn học]=? AND [Tên lớp]=?", params)
        
        # 3. Xóa Lớp học
        cursor.execute("DELETE FROM [LỚP HỌC] WHERE [Tên học kì]=? AND [Mã môn học]=? AND [Tên lớp]=?", params)
        
        conn.commit()
        return {"message": "Xóa lớp thành công"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()



# --- API LẤY TÀI LIỆU (Đã sửa lại để chắc chắn chạy) ---
@router.post("/classes/documents")
def get_class_documents(req: ReportRequest):
    conn = get_db_connection()
    # Kiểm tra kết nối
    if not conn: 
        raise HTTPException(status_code=500, detail="Mất kết nối tới Database SQL Server")
        
    cursor = conn.cursor()
    try:
        # SQL Server Query
        sql = """
            SELECT 
                tl.[Mã tài liệu] AS id,
                tl.[Tên] AS name,
                tl.[Mô tả] AS description,
                STRING_AGG(ttv.[Tên loại tài liệu], ', ') AS types
            FROM [Tài liệu lớp học] tl
            LEFT JOIN [TLLH THUỘC VỀ] ttv 
                ON tl.[Tên học kì] = ttv.[Tên học kì]
                AND tl.[Mã môn học] = ttv.[Mã môn học]
                AND tl.[Tên lớp] = ttv.[Tên lớp]
                AND tl.[Mã tài liệu] = ttv.[Mã tài liệu lớp học]
            WHERE tl.[Tên học kì] = ? 
              AND tl.[Mã môn học] = ? 
              AND tl.[Tên lớp] = ?
            GROUP BY tl.[Mã tài liệu], tl.[Tên], tl.[Mô tả]
        """
        cursor.execute(sql, (req.semester, req.subjectId, req.className))
        
        # Convert kết quả thủ công (Tránh lỗi dictionary cursor trên một số driver)
        columns = [column[0] for column in cursor.description]
        documents = []
        for row in cursor.fetchall():
            documents.append(dict(zip(columns, row)))
            
        return documents

    except Exception as e:
        print(f"Error fetching documents: {e}") # In lỗi ra terminal server
        raise HTTPException(status_code=400, detail=f"Lỗi SQL: {str(e)}")
    finally:
        conn.close()