# src/backend/app/api/v1/endpoints/functions.py
from fastapi import APIRouter, HTTPException
from ....db.session import get_db_connection
from ....models.report_model import ReportInput, ClassReport, StudentGrade

router = APIRouter()

@router.post("/reports/grades", response_model=ClassReport)
def get_class_grades(input_data: ReportInput):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Lỗi kết nối DB")
    
    cursor = conn.cursor()
    
    try:
        # --- [TODO] --- ĐIỀN CÂU LỆNH SQL GỌI HÀM VÀO ĐÂY
        # Yêu cầu: Gọi Function tính điểm tổng kết (Source 37)
        # Ví dụ: SELECT * FROM fn_BangDiemLopHoc(?)
        sql_query = "" 
        
        if not sql_query:
            # [MOCK] Trả về dữ liệu giả nếu chưa có SQL để Frontend không bị lỗi
            return {
                "className": f"Lớp {input_data.classId} (Mock Data)",
                "totalStudents": 0,
                "avgScore": 0.0,
                "passRate": "0%",
                "details": []
            }

        # Thực thi lệnh
        cursor.execute(sql_query, (input_data.classId,))
        rows = cursor.fetchall()
        
        # Xử lý dữ liệu trả về từ SQL
        students = []
        total_score = 0
        pass_count = 0
        
        for row in rows:
            # Giả sử SQL trả về: MSSV, HoTen, DiemBT, DiemThi, DiemTong
            # Bạn cần map đúng chỉ số cột (row[0], row[1]...)
            s = StudentGrade(
                id=row[0], 
                name=row[1], 
                assignment=row[2], 
                exam=row[3], 
                final=row[4]
            )
            students.append(s)
            
            total_score += s.final
            if s.final >= 5.0: # Giả sử 5.0 là qua môn
                pass_count += 1
        
        # Tính toán thống kê thêm ở tầng Ứng dụng (Application Logic)
        count = len(students)
        avg = round(total_score / count, 2) if count > 0 else 0
        rate = f"{round((pass_count / count) * 100, 1)}%" if count > 0 else "0%"

        return ClassReport(
            className=f"Lớp {input_data.classId}", # Có thể lấy tên thật từ DB nếu query trả về
            totalStudents=count,
            avgScore=avg,
            passRate=rate,
            details=students
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()