# src/backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import router mới
from .api.v1.endpoints import crud_items, functions, lists, crud_students # <--- Thêm crud_students

app = FastAPI(title="BK-LMS Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Router Lớp học
app.include_router(crud_items.router, prefix="/api/v1", tags=["Classes"])

# 2. Router Sinh viên (MỚI)
app.include_router(crud_students.router, prefix="/api/v1", tags=["Students"]) # <--- Đăng ký tại đây

# 3. Router Báo cáo & Tiện ích
app.include_router(functions.router, prefix="/api/v1", tags=["Reports"])
app.include_router(lists.router, prefix="/api/v1", tags=["Common Lists"])

@app.get("/")
def read_root():
    return {"message": "BK-LMS Backend is running!"}