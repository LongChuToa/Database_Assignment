from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Chỉ import 2 file quan trọng nhất
from .api.v1.endpoints import crud_items, functions

app = FastAPI(title="BK-LMS Minimal")

# Cấu hình CORS để Frontend gọi được
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Cho phép tất cả để test cho dễ
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký Router
# crud_items: Chứa API Thêm/Xóa/Tìm Lớp Học
app.include_router(crud_items.router, prefix="/api/v1", tags=["Classes"])

# functions: Chứa API Báo cáo điểm
app.include_router(functions.router, prefix="/api/v1", tags=["Reports"])

@app.get("/")
def root():
    return {"message": "BK-LMS Minimal API is Running"}