# src/backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import các router
from .api.v1.endpoints import crud_items, functions, lists

from security.decrypt_loader import load_encrypted_env 

# --- NẠP BIẾN MÔI TRƯỜNG MÃ HÓA ---
load_encrypted_env()
# -----------------------------------

app = FastAPI(title="BK-LMS Backend API")

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ĐĂNG KÝ ROUTER ---
# 1. Router cho Lớp học (CRUD, Search)
app.include_router(crud_items.router, prefix="/api/v1", tags=["Classes"])

# 2. Router cho Hàm/Báo cáo
app.include_router(functions.router, prefix="/api/v1", tags=["Reports"])

# 3. Router cho Danh sách phụ (Dropdown)
app.include_router(lists.router, prefix="/api/v1", tags=["Common Lists"])

@app.get("/")
def read_root():
    return {"message": "BK-LMS Backend is running successfully!"}