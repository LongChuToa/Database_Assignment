# src/backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import các router
from .api.v1.endpoints import auth, crud_items, crud_students, crud_users, functions, lists, crud_assignments

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký Routers
app.include_router(auth.router, prefix="/api/v1", tags=["Authentication"])
app.include_router(crud_items.router, prefix="/api/v1", tags=["Classes"])
app.include_router(crud_students.router, prefix="/api/v1", tags=["Students"])
app.include_router(crud_users.router, prefix="/api/v1", tags=["Users"]) # <--- Mới thêm
app.include_router(functions.router, prefix="/api/v1", tags=["Reports"])
app.include_router(lists.router, prefix="/api/v1", tags=["Common"])
app.include_router(crud_assignments.router, prefix="/api/v1", tags=["Assignments"])

@app.get("/")
def root():
    return {"message": "BK-LMS API Running"}